# User API

User management microservice — manages user profiles, roles, and preferences.

**Port**: 3002  
**Database**: `user_db` (PostgreSQL 15)

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Docker infrastructure running:
  ```bash
  cd Infrastructure/docker && docker-compose up -d
  ```
- Kafka running (user-api consumes `auth.events`)
- Verify `react-micro-user-db` container is healthy:
  ```bash
  docker-compose ps user-db
  ```

## Run Locally

```bash
# 1. Install dependencies
cd API/user-api
npm install

# 2. Create environment file
cat > .env << 'EOF'
USER_API_PORT=3002
USER_DB_HOST=localhost
USER_DB_PORT=5434
USER_DB_NAME=user_db
USER_DB_USER=postgres
USER_DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=user-api
KAFKA_GROUP_ID=user-api-group
EOF

# 3. Start the service
npm run dev
```

The service starts on **http://localhost:3002**. Verify with:

```bash
curl http://localhost:3002/health
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

| Method | Path         | Auth  | Description                |
| ------ | ------------ | ----- | -------------------------- |
| GET    | `/users`     | Admin | List all users (paginated) |
| GET    | `/users/:id` | Yes   | Get user profile           |
| PUT    | `/users/:id` | Yes   | Update user profile        |
| DELETE | `/users/:id` | Admin | Soft-delete user           |
| GET    | `/health`    | No    | Health check               |

See [full API reference](../../docs/api/user-api.md) for request/response schemas.

## Environment Variables

```env
USER_API_PORT=3002
USER_DB_HOST=localhost
USER_DB_PORT=5434
USER_DB_NAME=user_db
USER_DB_USER=postgres
USER_DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=user-api
KAFKA_GROUP_ID=user-api-group
```

## Kafka Events

| Direction | Topic         | Event                                    |
| --------- | ------------- | ---------------------------------------- |
| Consumes  | `auth.events` | `USER_REGISTERED` → creates user profile |
| Publishes | `user.events` | `USER_UPDATED`, `USER_DELETED`           |
