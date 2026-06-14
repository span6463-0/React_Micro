# Database

SQL schemas and Knex.js migration files for all three microservice databases.

---

## Structure

```
DB/
├── schemas/           Raw SQL schema definitions (for reference / first-time init)
│   ├── auth_schema.sql
│   ├── user_schema.sql
│   └── item_schema.sql
└── migrations/        Knex.js migration files (used for all ongoing changes)
    ├── 001_create_auth_tables.js
    ├── 002_create_user_tables.js
    └── 003_create_item_tables.js
```

---

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Docker infrastructure running:
  ```bash
  cd Infrastructure/docker
  docker-compose up -d
  ```
- All three PostgreSQL containers healthy (check with `docker-compose ps`)

---

## Install Knex CLI

```bash
npm install -g knex
```

Or use `npx knex` without a global install.

---

## Running Migrations

Each service has its own database. Run migrations against each one separately.

### Auth DB (port 5433)

```bash
cd DB/migrations

AUTH_DB_HOST=localhost \
AUTH_DB_PORT=5433 \
AUTH_DB_NAME=auth_db \
AUTH_DB_USER=postgres \
AUTH_DB_PASSWORD=postgres \
npx knex migrate:latest --knexfile knexfile.auth.js
```

### User DB (port 5434)

```bash
USER_DB_HOST=localhost \
USER_DB_PORT=5434 \
USER_DB_NAME=user_db \
USER_DB_USER=postgres \
USER_DB_PASSWORD=postgres \
npx knex migrate:latest --knexfile knexfile.user.js
```

### Item DB (port 5435)

```bash
ITEM_DB_HOST=localhost \
ITEM_DB_PORT=5435 \
ITEM_DB_NAME=item_db \
ITEM_DB_USER=postgres \
ITEM_DB_PASSWORD=postgres \
npx knex migrate:latest --knexfile knexfile.item.js
```

---

## Other Migration Commands

```bash
# Check migration status
npx knex migrate:status

# Roll back the last batch
npx knex migrate:rollback

# Roll back all migrations
npx knex migrate:rollback --all

# Create a new migration file
npx knex migrate:make 004_add_reviews_table
```

---

## Connecting to the Databases Locally

Use any PostgreSQL client (e.g. TablePlus, DBeaver, psql):

| Database | Host      | Port | DB Name | User     | Password |
| -------- | --------- | ---- | ------- | -------- | -------- |
| auth_db  | localhost | 5433 | auth_db | postgres | postgres |
| user_db  | localhost | 5434 | user_db | postgres | postgres |
| item_db  | localhost | 5435 | item_db | postgres | postgres |

```bash
# Connect via psql
psql -h localhost -p 5433 -U postgres -d auth_db
psql -h localhost -p 5434 -U postgres -d user_db
psql -h localhost -p 5435 -U postgres -d item_db
```

---

## Schema Overview

| Database  | Tables                                                  |
| --------- | ------------------------------------------------------- |
| `auth_db` | `users_auth`, `refresh_tokens`, `api_keys`              |
| `user_db` | `users`, `roles`, `user_roles`, `user_preferences`      |
| `item_db` | `items`, `item_categories`, `item_history`, `item_tags` |

See the `schemas/` folder for the full column definitions.

---

## Creating a New Migration

```bash
# Name follows the pattern: NNN_description
npx knex migrate:make 004_add_item_reviews --knexfile knexfile.item.js
```

Edit the generated file — add `up` (apply) and `down` (rollback) logic, then run the migration.
