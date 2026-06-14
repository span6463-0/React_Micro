---
applyTo: 'BFF/**'
---

# BFF Gateway Instructions

## Purpose

The BFF (Backend For Frontend) serves as the single entry point for all frontend requests:

- Aggregates responses from multiple microservices
- Handles authentication/authorization
- Manages session and refresh tokens
- Provides frontend-optimized API shapes

## Gateway Structure

```
gateway/
├── src/
│   ├── index.js           # Entry point
│   ├── app.js             # Express app setup
│   ├── config/            # Environment configuration
│   ├── routes/            # Route definitions
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   └── items.routes.js
│   ├── middleware/
│   │   ├── auth.js        # JWT validation
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── services/          # Service clients
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── itemService.js
│   └── utils/
├── Dockerfile
└── package.json
```

## Service Communication

```javascript
// Service client pattern
const axios = require('axios');

const authService = axios.create({
  baseURL: process.env.AUTH_API_URL,
  timeout: 5000,
  headers: { 'X-API-Key': process.env.INTERNAL_API_KEY },
});

// With circuit breaker for resilience
const CircuitBreaker = require('opossum');
const breaker = new CircuitBreaker(callService, options);
```

## Authentication Flow

1. Login: Forward to Auth API, set refresh token as httpOnly cookie
2. Protected routes: Validate JWT from Authorization header
3. Refresh: Use refresh token cookie to get new JWT
4. Logout: Clear cookies, invalidate refresh token

## Response Aggregation

```javascript
// Aggregate multiple service calls
const getUserDashboard = async (userId) => {
  const [user, items, stats] = await Promise.all([
    userService.getUser(userId),
    itemService.getUserItems(userId),
    itemService.getStats(userId),
  ]);

  return { user, items, stats };
};
```

## CORS Configuration

- Allow origins from environment variable
- Include credentials for cookies
- Expose custom headers as needed

## Rate Limiting

- Apply per-route limits
- Stricter limits on auth endpoints
- Use Redis for distributed rate limiting in production
