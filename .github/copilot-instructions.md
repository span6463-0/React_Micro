# React Micro - Enterprise Microfrontend Architecture

## Project Overview

Enterprise-grade microfrontend platform built with React, Node.js 24, and AWS infrastructure.

## Architecture Pattern

- **Frontend**: Module Federation micro-frontends (Shell + Remotes)
- **BFF**: Express.js API Gateway aggregating backend services
- **API**: Microservices (Auth, User, Item) with event-driven communication
- **Database**: PostgreSQL (AWS RDS) - one DB per service
- **Messaging**: Apache Kafka for inter-service communication
- **Infrastructure**: AWS ECS (Fargate), Terraform IaC

## Technology Stack

| Layer         | Technology                | Version    |
| ------------- | ------------------------- | ---------- |
| Runtime       | Node.js                   | 24.x LTS   |
| Language      | JavaScript (ES2024)       | -          |
| Frontend      | React + Vite              | 18.x + 5.x |
| State         | Redux Toolkit + RTK Query | 2.x        |
| Styling       | Tailwind CSS              | 3.x        |
| Backend       | Express.js                | 4.x        |
| Database      | PostgreSQL                | 15.x       |
| ORM           | Knex.js                   | 3.x        |
| Messaging     | KafkaJS                   | 2.x        |
| Auth          | JWT + Refresh Tokens      | -          |
| Container     | Docker                    | -          |
| Orchestration | AWS ECS Fargate           | -          |
| IaC           | Terraform                 | 1.x        |

## Project Structure

```
React_Micro/
├── .github/                    # CI/CD & Copilot context
├── Frontend/
│   ├── shell/                  # Host container app
│   ├── Dashboard/              # Remote: user dashboard
│   ├── Item-management/        # Remote: item CRUD
│   ├── LandingPage/            # Remote: public pages
│   └── shared/                 # Shared components, hooks, redux
├── BFF/
│   └── gateway/                # API Gateway service
├── API/
│   ├── auth-api/               # Authentication microservice
│   ├── user-api/               # User management microservice
│   ├── item-api/               # Item management microservice
│   └── shared/                 # Shared middleware & utilities
├── DB/
│   ├── schemas/                # SQL schema definitions
│   └── migrations/             # Knex migration files
├── Infrastructure/
│   ├── kafka/                  # Kafka topic configurations
│   └── docker/                 # Docker compose for local dev
└── Terraform/
    ├── modules/                # Reusable Terraform modules
    └── environments/           # dev/staging/prod configs
```

## Coding Standards

### JavaScript/React

- Use ES2024 features (Node 24 compatible)
- Functional components with hooks only (no class components)
- Use Redux Toolkit for state management
- Use RTK Query for API data fetching
- Prefer async/await over .then() chains
- Use destructuring for props and imports
- Named exports preferred over default exports

### Naming Conventions

| Type         | Convention                  | Example                |
| ------------ | --------------------------- | ---------------------- |
| Components   | PascalCase                  | `UserProfile.jsx`      |
| Hooks        | camelCase with `use` prefix | `useAuth.js`           |
| Utils        | camelCase                   | `formatDate.js`        |
| Constants    | SCREAMING_SNAKE_CASE        | `API_ENDPOINTS`        |
| Redux slices | camelCase + Slice           | `authSlice.js`         |
| API routes   | kebab-case                  | `/api/user-management` |
| DB tables    | snake_case                  | `user_sessions`        |

### File Structure per Component

```
ComponentName/
├── index.js              # Re-export
├── ComponentName.jsx     # Component logic
├── ComponentName.test.js # Unit tests
└── styles.js             # Tailwind variants (if complex)
```

### API Response Format

```javascript
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid credentials"
  }
}
```

### Authentication Flow

1. User submits credentials to BFF
2. BFF forwards to Auth API
3. Auth API validates and returns JWT + Refresh Token
4. JWT stored in memory, Refresh Token in httpOnly cookie
5. BFF validates JWT on each request
6. Refresh flow triggered when JWT expires

### Inter-Service Communication

- **Sync**: REST via BFF Gateway
- **Async**: Kafka events for cross-service updates
- **Topics**: `auth.events`, `user.events`, `item.events`

## Environment Variables Pattern

```
# Service-specific prefix
AUTH_API_PORT=3001
USER_API_PORT=3002
ITEM_API_PORT=3003
BFF_PORT=4000

# Database (per service)
AUTH_DB_HOST=localhost
AUTH_DB_NAME=auth_db

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=service-name

# JWT
JWT_SECRET=xxx
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Docker Patterns

- One Dockerfile per service
- Multi-stage builds (builder → runner)
- Non-root user for security
- Health check endpoints required
- Use .dockerignore to exclude node_modules

## Terraform Patterns

- Use modules for reusable infrastructure
- Environment-specific tfvars files
- Remote state in S3 with DynamoDB locking
- Tag all resources with: Project, Environment, Service

## Error Handling

- Use custom error classes extending Error
- Include error codes for client handling
- Log errors with correlation IDs
- Never expose stack traces in production

## Security Requirements

- Validate all inputs with Joi/Zod
- Sanitize SQL queries (use parameterized queries)
- Rate limiting on all public endpoints
- CORS configured per environment
- Helmet.js for security headers
- API keys for external service integration
