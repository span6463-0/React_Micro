# Infrastructure — Docker

Docker Compose setup for running all local development dependencies: three PostgreSQL databases, Apache Kafka, Zookeeper, Redis, and Kafka UI.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Ports 5433, 5434, 5435, 2181, 9092, 8080, 6379 available on your machine

---

## Start Infrastructure

```bash
cd Infrastructure/docker

docker-compose up -d
```

This starts all containers in detached mode. First run pulls images (~2–3 minutes depending on connection speed).

---

## Check Container Status

```bash
docker-compose ps
```

All containers should show `Up (healthy)` or `Up`. Example output:

```
NAME                        STATUS          PORTS
react-micro-auth-db         Up (healthy)    0.0.0.0:5433->5432/tcp
react-micro-user-db         Up (healthy)    0.0.0.0:5434->5432/tcp
react-micro-item-db         Up (healthy)    0.0.0.0:5435->5432/tcp
react-micro-zookeeper       Up              0.0.0.0:2181->2181/tcp
react-micro-kafka           Up (healthy)    0.0.0.0:9092->9092/tcp
react-micro-kafka-ui        Up              0.0.0.0:8080->8080/tcp
react-micro-redis           Up (healthy)    0.0.0.0:6379->6379/tcp
```

---

## Services & Ports

| Container               | Local Port | Purpose              |
| ----------------------- | ---------- | -------------------- |
| `react-micro-auth-db`   | **5433**   | PostgreSQL — auth_db |
| `react-micro-user-db`   | **5434**   | PostgreSQL — user_db |
| `react-micro-item-db`   | **5435**   | PostgreSQL — item_db |
| `react-micro-zookeeper` | 2181       | Kafka coordinator    |
| `react-micro-kafka`     | **9092**   | Kafka broker         |
| `react-micro-kafka-ui`  | **8080**   | Kafka management UI  |
| `react-micro-redis`     | **6379**   | Redis cache          |

---

## Useful Commands

```bash
# View logs for a specific container
docker-compose logs -f kafka
docker-compose logs -f auth-db

# Restart a single container
docker-compose restart kafka

# Stop all containers (preserves data volumes)
docker-compose down

# Stop and delete ALL data (full reset)
docker-compose down -v

# Open a shell inside a container
docker-compose exec auth-db psql -U postgres -d auth_db
```

---

## Kafka UI

Open **http://localhost:8080** in your browser to:

- Browse topics (`auth.events`, `user.events`, `item.events`)
- View consumer group offsets
- Produce test messages manually
- Monitor partition lag

---

## Kafka Topics

Topics are auto-created when the first message is produced. To create them explicitly:

```bash
cd ../kafka
chmod +x create-topics.sh
./create-topics.sh
```

---

## Troubleshooting

### Kafka container keeps restarting

Zookeeper must be healthy before Kafka starts. Wait 30 seconds after `docker-compose up` before checking:

```bash
docker-compose logs zookeeper
docker-compose restart kafka
```

### Port already in use

Find and stop the conflicting process:

```bash
# Windows
netstat -ano | findstr :5433
taskkill /PID <PID> /F

# macOS / Linux
lsof -i :5433
kill -9 <PID>
```

### Database data lost after restart

Data is persisted in Docker named volumes (`auth-db-data`, `user-db-data`, `item-db-data`). If you ran `docker-compose down -v`, the volumes were deleted — re-run your migrations.

---

## Building Docker Images

Dockerfiles for each service are also stored here:

| File                      | Used For                                          |
| ------------------------- | ------------------------------------------------- |
| `Dockerfile.api`          | Generic Node.js API services (user-api, item-api) |
| `Dockerfile.frontend`     | Vite-built React remotes served by nginx          |
| `nginx.conf`              | nginx config used inside the frontend image       |
| `BFF/gateway/Dockerfile`  | BFF Gateway multi-stage build                     |
| `API/auth-api/Dockerfile` | Auth API multi-stage build                        |

```bash
# Build BFF Gateway image
docker build -t react-micro/bff-gateway:latest \
  -f ../../BFF/gateway/Dockerfile \
  ../../BFF/gateway

# Build a frontend remote image (e.g. Dashboard)
docker build -t react-micro/dashboard:latest \
  -f Dockerfile.frontend \
  ../../Frontend/Dashboard
```
