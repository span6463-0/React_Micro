# Auth API

Authentication microservice — handles user registration, login, JWT issuance, refresh token rotation, and logout.

**Port**: 3001  
**Database**: `auth_db` (PostgreSQL 15)

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Docker infrastructure running:
  ```bash
  cd Infrastructure/docker && docker-compose up -d
  ```
- Verify `react-micro-auth-db` container is healthy:
  ```bash
  docker-compose ps auth-db
  ```

## Run Locally

```bash
# 1. Install dependencies
cd API/auth-api
npm install

# 2. Create environment file
cp .env.example .env

# 3. Start the service
npm run dev
```

The service starts on **http://localhost:3001**. Verify with:

```bash
curl http://localhost:3001/health
# → { "status": "ok" }
```

## Scripts

```bash
npm run dev      # Start with hot-reload (nodemon)
npm start        # Start without hot-reload
npm test         # Run tests
npm run lint     # Run ESLint
```

## Endpoints

| Method | Path        | Auth | Description                               |
| ------ | ----------- | ---- | ----------------------------------------- |
| POST   | `/register` | No   | Register a new user                       |
| POST   | `/login`    | No   | Authenticate, receive JWT + refresh token |
| POST   | `/refresh`  | No   | Rotate refresh token, get new JWT         |
| POST   | `/logout`   | Yes  | Invalidate refresh token                  |
| GET    | `/health`   | No   | Health check                              |

See [full API reference](../../docs/api/auth-api.md) for request/response schemas.

## Environment Variables

```env
AUTH_API_PORT=3001
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5433
AUTH_DB_NAME=auth_db
AUTH_DB_USER=postgres
AUTH_DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=auth-api
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Kafka Events Published

| Topic         | Event                                                  |
| ------------- | ------------------------------------------------------ |
| `auth.events` | `USER_REGISTERED`, `USER_LOGGED_IN`, `USER_LOGGED_OUT` |
