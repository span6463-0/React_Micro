---
applyTo: 'DB/**'
---

# Database Instructions

## PostgreSQL Standards

- Use snake_case for table and column names
- Always include `id`, `created_at`, `updated_at` columns
- Use UUID for primary keys
- Use TIMESTAMPTZ for timestamps
- Define foreign keys with ON DELETE behavior

## Schema Ownership

| Schema | Service  | Tables                                  |
| ------ | -------- | --------------------------------------- |
| auth   | auth-api | users_auth, refresh_tokens, api_keys    |
| users  | user-api | users, user_profiles, user_roles, roles |
| items  | item-api | items, item_categories, item_history    |

## Migration Pattern (Knex.js)

```javascript
// migrations/20240101_create_users.js
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
```

## Index Guidelines

- Index foreign keys
- Index columns used in WHERE clauses
- Use partial indexes for filtered queries
- Avoid over-indexing (impacts write performance)

## Connection Pooling

- Min: 2, Max: 10 per service
- Idle timeout: 10 seconds
- Use connection string from Secrets Manager
