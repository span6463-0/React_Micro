# BFF Gateway

Backend for Frontend — single entry point for all React micro-frontends. Aggregates Auth, User, and Item APIs.

**Port**: 4000

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Docker infrastructure running: `cd Infrastructure/docker && docker-compose up -d`
- All three API services running:
  - Auth API on port 5001
  - User API on port 5002
  - Item API on port 5003

## Run Locally

```bash
# 1. Install dependencies
cd BFF/gateway
npm install

# 2. Create environment file from template
cp .env.example .env
# Edit .env and set JWT_SECRET to a random string (min 32 characters)

# 3. Start the gateway
npm run dev
```

The gateway starts on **http://localhost:4000**. Verify with:

```bash
curl http://localhost:4000/health
# → { "status": "ok", "services": { "authApi": "ok", "userApi": "ok", "itemApi": "ok" } }
```

## Scripts

```bash
npm run dev      # Start with hot-reload (nodemon)
npm start        # Start without hot-reload
npm test         # Run tests
npm run lint     # Run ESLint
```

## Route Map

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout

GET    /api/users          (admin)
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id      (admin)

GET    /api/items
GET    /api/items/stats/overview
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id

GET /health
```

## Key Features

- **JWT validation** on every protected route
- **httpOnly cookie** for refresh token storage
- **Circuit breakers** (Opossum) on all downstream calls
- **Rate limiting** — 100 req / 15 min per IP
- **Correlation IDs** propagated to all services
- **Helmet** security headers

## Environment Variables

```env
NODE_ENV=development
BFF_PORT=4000
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
AUTH_API_URL=http://localhost:5001
USER_API_URL=http://localhost:5002
ITEM_API_URL=http://localhost:5003
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

See [BFF documentation](../../docs/bff/gateway.md) for full middleware, auth flow, and circuit breaker details.
