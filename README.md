# React Micro - Enterprise Microfrontend Architecture

Enterprise-grade microfrontend platform with React, Node.js 24, AWS infrastructure.

## Quick Start

### Prerequisites

- Node.js 24.x LTS
- Docker & Docker Compose
- AWS CLI (for deployment)
- Terraform 1.x (for infrastructure)

### Local Development

```bash
# Start infrastructure (databases, Kafka)
cd Infrastructure/docker
docker-compose up -d

# Install dependencies
cd Frontend/shell && npm install
cd ../shared && npm install
cd ../LandingPage && npm install
cd ../Dashboard && npm install
cd ../Item-management && npm install

# Start all frontends
cd Frontend/shell && npm run dev        # Port 3000
cd Frontend/LandingPage && npm run dev  # Port 3001
cd Frontend/Dashboard && npm run dev    # Port 3002
cd Frontend/Item-management && npm run dev # Port 3003

# Start BFF & APIs
cd BFF/gateway && npm install && npm run dev  # Port 4000
cd API/auth-api && npm install && npm run dev # Port 3001
cd API/user-api && npm install && npm run dev # Port 3002
cd API/item-api && npm install && npm run dev # Port 3003
```

### Database Migrations

```bash
cd DB/migrations
npx knex migrate:latest --knexfile knexfile.js
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Shell)                    │
│  ┌─────────────┬─────────────┬─────────────────────┐   │
│  │ LandingPage │  Dashboard  │   Item Management   │   │
│  │   (Remote)  │   (Remote)  │      (Remote)       │   │
│  └─────────────┴─────────────┴─────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │   BFF   │
                    │ Gateway │
                    └────┬────┘
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Auth API│    │User API │    │Item API │
    └────┬────┘    └────┬────┘    └────┬────┘
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │auth_db  │    │user_db  │    │item_db  │
    └─────────┘    └─────────┘    └─────────┘
         │               │               │
         └───────────────┼───────────────┘
                    ┌────▼────┐
                    │  Kafka  │
                    └─────────┘
```

## Project Structure

```
React_Micro/
├── Frontend/           # React micro-frontends (Module Federation)
│   ├── shell/          # Host container (Port 3000)
│   ├── shared/         # Shared components & hooks
│   ├── LandingPage/    # Public pages (Port 3001)
│   ├── Dashboard/      # User dashboard (Port 3002)
│   └── Item-management/# Item CRUD (Port 3003)
├── BFF/
│   └── gateway/        # API Gateway (Port 4000)
├── API/
│   ├── auth-api/       # Authentication service
│   ├── user-api/       # User management service
│   ├── item-api/       # Item management service
│   └── shared/         # Shared middleware & utils
├── DB/
│   ├── schemas/        # SQL schema definitions
│   └── migrations/     # Knex migrations
├── Infrastructure/
│   ├── docker/         # Docker Compose for local dev
│   └── kafka/          # Kafka topic configurations
└── Terraform/
    ├── modules/        # Reusable infrastructure modules
    └── environments/   # Environment-specific configs
```

## Technology Stack

| Layer         | Technology                |
| ------------- | ------------------------- |
| Runtime       | Node.js 24.x LTS          |
| Frontend      | React 18.x + Vite 5.x     |
| Federation    | Module Federation         |
| State         | Redux Toolkit + RTK Query |
| Styling       | Tailwind CSS 3.x          |
| Backend       | Express.js 4.x            |
| Database      | PostgreSQL 15.x           |
| ORM           | Knex.js 3.x               |
| Messaging     | Apache Kafka (KafkaJS)    |
| Auth          | JWT + Refresh Tokens      |
| Container     | Docker                    |
| Orchestration | AWS ECS Fargate           |
| IaC           | Terraform 1.x             |

## Deployment

### Infrastructure Setup (Terraform)

```bash
cd Terraform

# Initialize
terraform init

# Plan (dev environment)
terraform plan -var-file="environments/dev/terraform.tfvars"

# Apply
terraform apply -var-file="environments/dev/terraform.tfvars"
```

### Build & Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Build and push each service
docker build -t react-micro/bff-gateway ./BFF/gateway
docker push <ecr-url>/react-micro/bff-gateway:latest
```

## Environment Variables

See `.env.example` files in each service for required configuration.

## License

Proprietary - All rights reserved
