# Auth API

Handles all authentication operations: registration, login, token refresh, and logout.

**Direct Service Port**: 5001 (internal)  
**BFF Base Path**: `/api/auth`

---

## Endpoints

### POST /api/auth/register

Register a new user account.

**Auth Required**: No

**Request Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

| Field      | Type   | Required | Rules                              |
| ---------- | ------ | -------- | ---------------------------------- |
| `name`     | string | Yes      | 2–100 characters                   |
| `email`    | string | Yes      | Valid email format                 |
| `password` | string | Yes      | Min 8 chars, 1 uppercase, 1 number |

**Response `201`**

```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane@example.com"
  }
}
```

**Side Effects**  
Publishes `USER_REGISTERED` event to `auth.events` Kafka topic → User API creates a profile record.

---

### POST /api/auth/login

Authenticate with email and password.

**Auth Required**: No

**Request Body**

```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "token": "<jwt_access_token>",
    "user": {
      "id": "550e8400-...",
      "email": "jane@example.com",
      "role": "user"
    }
  }
}
```

**Cookies Set**  
`refreshToken` — httpOnly, Secure (production), SameSite=Strict, 7-day expiry.

---

### POST /api/auth/refresh

Exchange a refresh token for a new access token.

**Auth Required**: No (uses httpOnly cookie)

**Request**: No body required — refresh token read from cookie.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "token": "<new_jwt_access_token>"
  }
}
```

The response also sets an updated `refreshToken` cookie.

---

### POST /api/auth/logout

Invalidate the current refresh token.

**Auth Required**: Yes

**Request**: No body required.

**Response `200`**

```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

The `refreshToken` cookie is cleared.

---

## JWT Token Structure

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "jane@example.com",
  "role": "user",
  "iat": 1700000000,
  "exp": 1700000900
}
```

| Claim   | Description                    |
| ------- | ------------------------------ |
| `sub`   | User UUID                      |
| `email` | User email                     |
| `role`  | `user` or `admin`              |
| `iat`   | Issued at (Unix timestamp)     |
| `exp`   | Expiry — 15 minutes from issue |

---

## Database Tables

| Table            | Purpose                                |
| ---------------- | -------------------------------------- |
| `users_auth`     | Credentials, roles, email verification |
| `refresh_tokens` | Active refresh token records           |
| `api_keys`       | Service-to-service API key management  |

---

## Kafka Events Published

| Topic         | Event Type        | Payload                   |
| ------------- | ----------------- | ------------------------- |
| `auth.events` | `USER_REGISTERED` | `{ userId, email, name }` |
| `auth.events` | `USER_LOGGED_IN`  | `{ userId, email }`       |
| `auth.events` | `USER_LOGGED_OUT` | `{ userId }`              |
