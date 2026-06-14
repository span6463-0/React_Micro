# Item API

Item management microservice — CRUD for items, inventory tracking, categories, and audit history.

**Port**: 5003  
**Database**: `item_db` (PostgreSQL 15)

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Docker infrastructure running:
  ```bash
  cd Infrastructure/docker && docker-compose up -d
  ```
- Verify `react-micro-item-db` container is healthy:
  ```bash
  docker-compose ps item-db
  ```

## Run Locally

```bash
# 1. Install dependencies
cd API/item-api
npm install

# 2. Create environment file
cat > .env << 'EOF'
ITEM_API_PORT=5003
ITEM_DB_HOST=localhost
ITEM_DB_PORT=5435
ITEM_DB_NAME=item_db
ITEM_DB_USER=postgres
ITEM_DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=item-api
EOF

# 3. Start the service
npm run dev
```

The service starts on **http://localhost:5003**. Verify with:

```bash
curl http://localhost:5003/health
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

| Method | Path                    | Auth | Description                        |
| ------ | ----------------------- | ---- | ---------------------------------- |
| GET    | `/items`                | No   | List items (paginated, filterable) |
| GET    | `/items/stats/overview` | Yes  | Inventory statistics               |
| GET    | `/items/:id`            | No   | Get item details                   |
| POST   | `/items`                | Yes  | Create item                        |
| PUT    | `/items/:id`            | Yes  | Update item                        |
| DELETE | `/items/:id`            | Yes  | Archive item                       |
| GET    | `/health`               | No   | Health check                       |

See [full API reference](../../docs/api/item-api.md) for request/response schemas.

## Environment Variables

```env
ITEM_API_PORT=5003
ITEM_DB_HOST=localhost
ITEM_DB_PORT=5435
ITEM_DB_NAME=item_db
ITEM_DB_USER=postgres
ITEM_DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=item-api
```

## Kafka Events Published

| Topic         | Event                                                           |
| ------------- | --------------------------------------------------------------- |
| `item.events` | `ITEM_CREATED`, `ITEM_UPDATED`, `ITEM_DELETED`, `STOCK_UPDATED` |
