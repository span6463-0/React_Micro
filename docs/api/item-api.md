# Item API

Manages items including CRUD operations, inventory tracking, categories, and audit history.

**Direct Service Port**: 3003 (internal)  
**BFF Base Path**: `/api/items`

---

## Endpoints

### GET /api/items

Retrieve a paginated list of items.

**Auth Required**: No (public) — authenticated users see additional fields.

**Query Parameters**

| Parameter  | Type   | Default | Description                          |
| ---------- | ------ | ------- | ------------------------------------ |
| `page`     | number | 1       | Page number                          |
| `limit`    | number | 10      | Records per page                     |
| `category` | string | —       | Filter by category name              |
| `status`   | string | —       | `Draft`, `Active`, or `Archived`     |
| `search`   | string | —       | Full-text search on name/description |

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-...",
      "name": "Wireless Headphones",
      "category": "Electronics",
      "price": 79.99,
      "sku": "WH-001",
      "stock": 150,
      "status": "Active"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 85, "totalPages": 9 }
}
```

---

### GET /api/items/:id

Get a single item by ID.

**Auth Required**: No

**Response `200`**

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Wireless Headphones",
    "description": "Over-ear, noise cancelling headphones.",
    "category": "Electronics",
    "price": 79.99,
    "sku": "WH-001",
    "stock": 150,
    "status": "Active",
    "tags": ["audio", "wireless", "premium"],
    "created_at": "2026-01-10T08:00:00Z",
    "updated_at": "2026-06-01T12:00:00Z"
  }
}
```

---

### POST /api/items

Create a new item.

**Auth Required**: Yes

**Request Body**

```json
{
  "name": "Wireless Headphones",
  "description": "Over-ear, noise cancelling headphones.",
  "category": "Electronics",
  "price": 79.99,
  "sku": "WH-001",
  "stock": 150,
  "status": "Draft",
  "tags": ["audio", "wireless"]
}
```

| Field      | Type   | Required | Rules                                   |
| ---------- | ------ | -------- | --------------------------------------- |
| `name`     | string | Yes      | Max 255 chars                           |
| `category` | string | Yes      | Must exist in categories                |
| `price`    | number | Yes      | Positive decimal                        |
| `sku`      | string | Yes      | Unique across all items                 |
| `stock`    | number | No       | Default 0                               |
| `status`   | string | No       | `Draft` (default), `Active`, `Archived` |

**Response `201`**

```json
{
  "success": true,
  "data": { "id": "a1b2c3d4-...", "name": "Wireless Headphones", "sku": "WH-001" }
}
```

---

### PUT /api/items/:id

Update an existing item.

**Auth Required**: Yes

**Request Body** (all fields optional)

```json
{
  "name": "Wireless Headphones Pro",
  "price": 89.99,
  "stock": 200,
  "status": "Active"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": { "id": "a1b2c3d4-...", "name": "Wireless Headphones Pro" }
}
```

Every update creates an `item_history` audit record automatically.

---

### DELETE /api/items/:id

Delete an item (sets `status = 'Archived'` for soft-delete).

**Auth Required**: Yes

**Response `200`**

```json
{
  "success": true,
  "data": { "message": "Item deleted successfully" }
}
```

---

### GET /api/items/stats/overview

Get inventory statistics for the authenticated user's items.

**Auth Required**: Yes

**Response `200`**

```json
{
  "success": true,
  "data": {
    "totalItems": 42,
    "activeItems": 30,
    "draftItems": 8,
    "archivedItems": 4,
    "totalValue": 18549.5,
    "lowStockItems": 3
  }
}
```

---

## Database Tables

| Table             | Purpose                                |
| ----------------- | -------------------------------------- |
| `items`           | Core item data, pricing, inventory     |
| `item_categories` | Hierarchical category definitions      |
| `item_history`    | Audit log of all changes (JSONB diffs) |
| `item_tags`       | Many-to-many item↔tag relationship     |

---

## Kafka Events Published

| Topic         | Event Type      | Payload                                 |
| ------------- | --------------- | --------------------------------------- |
| `item.events` | `ITEM_CREATED`  | `{ itemId, name, category, createdBy }` |
| `item.events` | `ITEM_UPDATED`  | `{ itemId, changes, updatedBy }`        |
| `item.events` | `ITEM_DELETED`  | `{ itemId }`                            |
| `item.events` | `STOCK_UPDATED` | `{ itemId, oldStock, newStock }`        |
