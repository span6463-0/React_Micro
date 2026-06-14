# System Architecture Overview

## Platform Summary

React Micro is an enterprise-grade microfrontend platform following a Domain-Driven Design approach. Each business domain (Auth, User, Items) owns its full vertical slice: UI remote, dedicated API, and isolated database.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│              Frontend Shell (Port 3000)                         │
│         React + Module Federation Host                          │
│  ┌──────────────┬──────────────┬──────────────────────────┐    │
│  │  LandingPage │  Dashboard   │    Item-management       │    │
│  │  (Port 3001) │  (Port 3002) │      (Port 3003)         │    │
│  │   Remote     │   Remote     │       Remote             │    │
│  └──────────────┴──────────────┴──────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────────┐
│                   BFF Gateway (Port 4000)                       │
│              Express.js API Gateway                             │
│         JWT Validation · Rate Limiting · Circuit Breaker        │
└──────────┬──────────────────┬──────────────────────┬───────────┘
           │                  │                      │
     ┌─────▼──────┐   ┌───────▼──────┐   ┌──────────▼──────┐
     │  Auth API  │   │   User API   │   │    Item API     │
     │ (Port 3001)│   │ (Port 3002)  │   │  (Port 3003)    │
     └─────┬──────┘   └───────┬──────┘   └──────────┬──────┘
           │                  │                      │
     ┌─────▼──────┐   ┌───────▼──────┐   ┌──────────▼──────┐
     │  auth_db   │   │   user_db    │   │    item_db      │
     │ PostgreSQL │   │  PostgreSQL  │   │   PostgreSQL    │
     └────────────┘   └───────┬──────┘   └──────────┬──────┘
                              │                      │
                    ┌─────────▼──────────────────────▼──────┐
                    │               Apache Kafka              │
                    │   auth.events · user.events · item.events│
                    └────────────────────────────────────────┘
```

## Design Principles

| Principle                  | Implementation                                            |
| -------------------------- | --------------------------------------------------------- |
| **Domain Isolation**       | Each service owns its database; no cross-DB joins         |
| **Async-First**            | Kafka events for cross-service communication              |
| **Security-by-Default**    | JWT + refresh tokens, API keys, rate limiting, Helmet     |
| **Resilience**             | Circuit breakers (Opossum) on all downstream calls in BFF |
| **Observability**          | Correlation IDs on every request, structured logging      |
| **Infrastructure-as-Code** | All AWS resources managed via Terraform modules           |

## Request Flow

### Authenticated Request

```
Client → Shell → BFF (JWT validate) → API Service → PostgreSQL
                        ↑
                 httpOnly Cookie
                (Refresh Token)
```

### Cross-Service Event

```
Auth API → Kafka (auth.events: USER_REGISTERED) → User API
                                                    └→ Creates user profile
```

## Port Allocation

| Service                | Local Port       | Purpose                 |
| ---------------------- | ---------------- | ----------------------- |
| Shell                  | 3000             | React host container    |
| LandingPage Remote     | 3001             | Public-facing pages     |
| Dashboard Remote       | 3002             | User dashboard          |
| Item-management Remote | 3003             | Item CRUD UI            |
| BFF Gateway            | 4000             | API aggregation layer   |
| Auth API               | 5001             | Authentication service  |
| User API               | 5002             | User management service |
| Item API               | 5003             | Item management service |
| auth_db                | 5433             | Auth PostgreSQL         |
| user_db                | 5434             | User PostgreSQL         |
| item_db                | 5435             | Item PostgreSQL         |
| Kafka                  | 9092             | Message broker          |
| Kafka UI               | 8080             | Kafka management UI     |
| Redis                  | 6379             | Cache / rate limiting   |

## Technology Decisions

### Module Federation

Micro-frontends are loaded at runtime using Vite's Module Federation plugin. Each remote exposes its own routes and components. The shell dynamically loads remotes — allowing independent deployments without rebuilding the shell.

### Database-per-Service

Each microservice has its own PostgreSQL instance (separate RDS in AWS). This enforces domain boundaries and enables independent scaling, backup, and migration strategies.

### BFF Pattern

The Backend for Frontend gateway provides a single entry point for the React client. It handles cross-cutting concerns (auth, rate limiting, correlation IDs) and aggregates data from multiple services when needed, reducing client-side complexity.

### Event-Driven Communication

Services communicate asynchronously via Kafka topics. This decouples services and enables eventual consistency — for example, the User API creates a profile record only after receiving a `USER_REGISTERED` event from the Auth API.
