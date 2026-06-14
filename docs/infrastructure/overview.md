# Infrastructure — Local Development

Local development uses Docker Compose to run all infrastructure dependencies: three PostgreSQL databases, Apache Kafka, Zookeeper, Redis, and Kafka UI.

---

## Starting Local Infrastructure

```bash
cd Infrastructure/docker
docker-compose up -d
```

This starts:

| Container               | Port | Description            |
| ----------------------- | ---- | ---------------------- |
| `react-micro-auth-db`   | 5433 | PostgreSQL for auth_db |
| `react-micro-user-db`   | 5434 | PostgreSQL for user_db |
| `react-micro-item-db`   | 5435 | PostgreSQL for item_db |
| `react-micro-zookeeper` | 2181 | Kafka coordinator      |
| `react-micro-kafka`     | 9092 | Kafka broker           |
| `react-micro-kafka-ui`  | 8080 | Kafka management UI    |
| `react-micro-redis`     | 6379 | Redis cache            |

---

## Stopping & Resetting

```bash
# Stop containers (preserve data volumes)
docker-compose down

# Stop and delete all data volumes (full reset)
docker-compose down -v

# View logs
docker-compose logs -f kafka
docker-compose logs -f auth-db
```

---

## Kafka UI

Visit **http://localhost:8080** to browse:

- Topics and their partition details
- Consumer group offsets
- Produce and consume test messages

---

## Kafka Topics

Topics are auto-created on first use (configured with `KAFKA_AUTO_CREATE_TOPICS_ENABLE=true`).

For production or explicit local setup:

```bash
cd Infrastructure/kafka
chmod +x create-topics.sh
./create-topics.sh
```

### Topic Definitions

| Topic         | Partitions | Retention | Purpose                         |
| ------------- | ---------- | --------- | ------------------------------- |
| `auth.events` | 3          | 7 days    | Authentication lifecycle events |
| `user.events` | 3          | 30 days   | User profile changes            |
| `item.events` | 6          | 30 days   | Item CRUD and inventory changes |

### Consumer Groups

| Group ID             | Subscribes To | Consumer                                    |
| -------------------- | ------------- | ------------------------------------------- |
| `user-api-group`     | `auth.events` | User API — creates profiles on registration |
| `item-api-group`     | `user.events` | Item API — tracks ownership changes         |
| `notification-group` | all topics    | Notification service                        |
| `analytics-group`    | all topics    | Analytics processing                        |

---

## Database Connections

### Auth DB

```
Host: localhost
Port: 5433
Database: auth_db
User: postgres
Password: postgres
```

### User DB

```
Host: localhost
Port: 5434
Database: user_db
User: postgres
Password: postgres
```

### Item DB

```
Host: localhost
Port: 5435
Database: item_db
User: postgres
Password: postgres
```

---

## Docker Images Reference

| Image        | Dockerfile                | Usage                          |
| ------------ | ------------------------- | ------------------------------ |
| API services | `Dockerfile.api`          | Generic Node.js API template   |
| BFF Gateway  | `BFF/gateway/Dockerfile`  | Multi-stage BFF build          |
| Auth API     | `API/auth-api/Dockerfile` | Multi-stage auth service build |
| Frontend     | `Dockerfile.frontend`     | Vite build + nginx serving     |

All images use:

- `node:24-alpine` base (smallest secure image)
- Multi-stage builds (builder + runner layers)
- Non-root user (`nodejs`, UID 1001)
- Health checks on `/health` endpoint
