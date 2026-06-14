# API Reference

All APIs are accessed through the **BFF Gateway** at `http://localhost:4000`. Direct service access is for internal/Kafka communication only.

## Base URL

```
Development: http://localhost:4000
Production:  https://api.your-domain.com
```

## Authentication

Include the JWT access token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

The refresh token is stored in an `httpOnly` cookie and is automatically sent by the browser.

## Standard Response Format

### Success

```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "total": 100, "totalPages": 10 }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid credentials"
  }
}
```

## Error Codes

| Code          | HTTP Status | Description                    |
| ------------- | ----------- | ------------------------------ |
| `VALIDATION`  | 400         | Request body failed validation |
| `AUTH_001`    | 401         | Invalid credentials            |
| `AUTH_002`    | 401         | Token expired                  |
| `AUTH_003`    | 401         | Invalid token                  |
| `AUTH_004`    | 403         | Insufficient permissions       |
| `AUTH_005`    | 401         | No refresh token provided      |
| `USER_EXISTS` | 409         | Email already registered       |
| `NOT_FOUND`   | 404         | Resource not found             |
| `RATE_LIMIT`  | 429         | Too many requests              |
| `INTERNAL`    | 500         | Internal server error          |

## Services

- [Auth API](./auth-api.md) — Registration, login, token management
- [User API](./user-api.md) — User profiles and preferences
- [Item API](./item-api.md) — Item CRUD and inventory
