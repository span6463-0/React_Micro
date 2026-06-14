# Getting Started

Welcome to the **React Micro** engineering team. This guide will help you set up your development environment and understand the project structure.

---

## Prerequisites

Install the following tools before you begin:

| Tool           | Version  | Install                                                                  |
| -------------- | -------- | ------------------------------------------------------------------------ |
| Node.js        | 24.x LTS | [nvm](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org) |
| Docker Desktop | Latest   | [docker.com](https://www.docker.com/products/docker-desktop)             |
| Git            | Latest   | [git-scm.com](https://git-scm.com)                                       |
| VS Code        | Latest   | [code.visualstudio.com](https://code.visualstudio.com)                   |
| AWS CLI        | v2       | [aws.amazon.com/cli](https://aws.amazon.com/cli/) (for cloud work)       |
| Terraform      | 1.x      | [terraform.io](https://www.terraform.io) (for infrastructure work)       |

---

## Step 1 — Clone and Set Up Node

```bash
# Clone the repository
git clone <repository-url>
cd React_Micro

# Use correct Node.js version
nvm install 24
nvm use 24    # .nvmrc sets this automatically

# Verify
node --version   # Should print v24.x.x
```

---

## Step 2 — Start Local Infrastructure

All databases, Kafka, and Redis run in Docker:

```bash
cd Infrastructure/docker
docker-compose up -d

# Verify all containers are healthy
docker-compose ps
```

Wait ~30 seconds for Kafka to fully initialize. Then open **http://localhost:8080** to access the Kafka UI.

---

## Step 3 — Install Dependencies

Install dependencies for all services:

```bash
# From the project root
cd Frontend/shell && npm install && cd ../..
cd Frontend/shared && npm install && cd ../..
cd Frontend/LandingPage && npm install && cd ../..
cd Frontend/Dashboard && npm install && cd ../..
cd Frontend/Item-management && npm install && cd ../..

cd BFF/gateway && npm install && cd ../..
cd API/auth-api && npm install && cd ../..
cd API/user-api && npm install && cd ../..
cd API/item-api && npm install && cd ../..
```

---

## Step 4 — Configure Environment Variables

Copy `.env.example` files and fill in local values:

```bash
cp BFF/gateway/.env.example BFF/gateway/.env
```

Minimum local `.env` for BFF:

```env
NODE_ENV=development
BFF_PORT=4000
JWT_SECRET=local-dev-secret-key-minimum-32-characters
AUTH_API_URL=http://localhost:5001
USER_API_URL=http://localhost:5002
ITEM_API_URL=http://localhost:5003
CORS_ORIGINS=http://localhost:3000
```

Each API service needs its own `.env` — see the service-level READMEs for details.

---

## Step 5 — Run Database Migrations

```bash
cd DB/migrations
# Run against each DB
AUTH_DB_HOST=localhost AUTH_DB_PORT=5433 AUTH_DB_NAME=auth_db AUTH_DB_USER=postgres AUTH_DB_PASSWORD=postgres npx knex migrate:latest
```

---

## Step 6 — Start All Services

Open **separate terminals** for each service:

```bash
# Terminal 1 — API services
cd API/auth-api && npm run dev     # http://localhost:5001
cd API/user-api && npm run dev     # http://localhost:5002
cd API/item-api && npm run dev     # http://localhost:5003

# Terminal 2 — BFF Gateway
cd BFF/gateway && npm run dev      # http://localhost:4000

# Terminal 3 — Frontend remotes
cd Frontend/LandingPage && npm run dev    # http://localhost:3001 (Vite)
cd Frontend/Dashboard && npm run dev      # http://localhost:3002 (Vite)
cd Frontend/Item-management && npm run dev # http://localhost:3003 (Vite)

# Terminal 4 — Shell (start last)
cd Frontend/shell && npm run dev   # http://localhost:3000
```

> **Note**: Start the remotes before the shell, as the shell loads remotes at startup.

---

## Step 7 — Verify Everything Works

1. Open **http://localhost:3000** — you should see the landing page
2. Register a new account at `/register`
3. Log in at `/login` — you should be redirected to `/dashboard`
4. Navigate to `/items` and create a test item

---

## Recommended VS Code Extensions

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **GitLens** — `eamodio.gitlens`
- **Thunder Client** — `rangav.vscode-thunder-client` (API testing)
- **Docker** — `ms-azuretools.vscode-docker`

---

## Next Steps

- Read the [Developer Guide](./developer-guide.md) for day-to-day workflows
- Review the [Architecture Overview](../architecture/overview.md)
- Check the [API Reference](../api/README.md) before building new features
