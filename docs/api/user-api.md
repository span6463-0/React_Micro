# User API

Manages user profiles, roles, and preferences.

**Direct Service Port**: 5002 (internal)  
**BFF Base Path**: `/api/users`

---

## Endpoints

### GET /api/users

Retrieve a paginated list of users.

**Auth Required**: Yes — `admin` role only

**Query Parameters**

| Parameter | Type   | Default | Description                |
| --------- | ------ | ------- | -------------------------- |
| `page`    | number | 1       | Page number                |
| `limit`   | number | 10      | Records per page (max 100) |
| `search`  | string | —       | Search by name or email    |

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "is_active": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

### GET /api/users/:id

Get a user's profile by ID.

**Auth Required**: Yes — users can view their own profile; admins can view any.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-0100",
    "bio": "Software engineer",
    "avatar_url": "https://cdn.example.com/avatars/jane.jpg",
    "role": "user",
    "is_active": true,
    "preferences": {
      "language": "en",
      "timezone": "America/New_York",
      "theme": "dark",
      "email_notifications": true
    }
  }
}
```

---

### PUT /api/users/:id

Update a user profile.

**Auth Required**: Yes — users can update their own profile; admins can update any.

**Request Body** (all fields optional)

```json
{
  "name": "Jane Smith",
  "phone": "+1-555-0101",
  "bio": "Senior Software Engineer",
  "avatar_url": "https://cdn.example.com/avatars/jane-new.jpg"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": { "id": "550e8400-...", "name": "Jane Smith" }
}
```

---

### DELETE /api/users/:id

Soft-delete a user account (sets `is_active = false`).

**Auth Required**: Yes — `admin` role only

**Response `200`**

```json
{
  "success": true,
  "data": { "message": "User deleted successfully" }
}
```

---

## Database Tables

| Table              | Purpose                                 |
| ------------------ | --------------------------------------- |
| `users`            | Profile data: name, email, avatar, bio  |
| `roles`            | Role definitions with permission arrays |
| `user_roles`       | Many-to-many user↔role mapping          |
| `user_preferences` | Per-user UI/notification preferences    |

---

## Kafka Events Consumed

| Topic         | Event Type        | Action                      |
| ------------- | ----------------- | --------------------------- |
| `auth.events` | `USER_REGISTERED` | Creates user profile record |

## Kafka Events Published

| Topic         | Event Type     | Payload               |
| ------------- | -------------- | --------------------- |
| `user.events` | `USER_UPDATED` | `{ userId, changes }` |
| `user.events` | `USER_DELETED` | `{ userId }`          |
