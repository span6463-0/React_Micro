# Developer Guide

Day-to-day development workflows, conventions, and best practices.

---

## Code Style & Linting

This project enforces consistent style via ESLint and Prettier.

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format code
npm run format
```

ESLint extends the Airbnb config with React and custom overrides. Key rules:

- `no-console` — use the `logger` utility instead
- `import/extensions` — include `.js`/`.jsx` in all imports
- `react/prop-types` — always define prop types

---

## Git Workflow

### Branch Naming

```
feature/<ticket>-short-description
bugfix/<ticket>-short-description
hotfix/<ticket>-short-description
chore/<description>
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

Examples:
feat(auth): add email verification flow
fix(bff): handle circuit breaker timeout correctly
docs(api): update user endpoint response schema
chore(deps): upgrade express to 4.19.2
refactor(frontend): extract useAuth hook to shared library
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

### Pull Request Process

1. Branch from `main`
2. Commit changes with conventional commit messages
3. Run `npm run lint` and `npm test` locally
4. Open PR with description linking to the ticket
5. Require 1+ reviewer approval before merge
6. Squash-merge into `main`

---

## Adding a New API Endpoint

### 1. Define the route in BFF (`BFF/gateway/src/routes/`)

```javascript
// items.routes.js
router.get('/export', authenticate, async (req, res, next) => {
  try {
    const result = await itemService.export(req.user.id, req.correlationId);
    res.json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});
```

### 2. Add the service method in BFF (`BFF/gateway/src/services/`)

```javascript
// itemService.js
async export(userId, correlationId) {
  return this.circuitBreaker.fire('get', `/items/export?userId=${userId}`, {
    headers: { 'X-Correlation-ID': correlationId },
  });
}
```

### 3. Implement in the API service (`API/item-api/src/`)

Add the business logic and database query in the API.

### 4. Document in `docs/api/item-api.md`

Add the endpoint to the API reference with request/response examples.

---

## Adding a New Frontend Feature

### 1. Create the component

Follow the component folder structure:

```
ComponentName/
├── index.js              # Named re-export
├── ComponentName.jsx     # Component logic
└── ComponentName.test.js # Unit tests (Vitest + RTL)
```

### 2. Add RTK Query endpoint (if fetching data)

```javascript
// In the remote's api slice
const newEndpoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExport: builder.query({
      query: () => '/items/export',
      providesTags: ['Items'],
    }),
  }),
});
export const { useGetExportQuery } = newEndpoint;
```

### 3. Use in your component

```javascript
const { data, isLoading, error } = useGetExportQuery();
```

---

## Running Tests

```bash
# Unit tests (Vitest)
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Working with Kafka Events

### Publishing an Event

```javascript
import { KafkaProducer } from '../../API/shared/utils/kafka.js';

const producer = new KafkaProducer('item-api');
await producer.connect();

await producer.publish('item.events', itemId, {
  type: 'ITEM_CREATED',
  itemId,
  name: item.name,
  createdBy: userId,
});
```

### Consuming Events

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS] });
const consumer = kafka.consumer({ groupId: 'my-service-group' });

await consumer.connect();
await consumer.subscribe({ topic: 'auth.events', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString());
    if (event.type === 'USER_REGISTERED') {
      // Handle the event
    }
  },
});
```

---

## Database Migrations

### Create a New Migration

```bash
cd DB/migrations
npx knex migrate:make 004_add_item_reviews --knexfile knexfile.js
```

### Run Migrations

```bash
npx knex migrate:latest
```

### Roll Back

```bash
npx knex migrate:rollback
```

Migrations follow the naming convention `NNN_description.js` (zero-padded 3-digit sequence).

---

## Logging

Use the shared logger (never `console.log` in production code):

```javascript
import { logger } from '../../API/shared/utils/logger.js';

logger.info('Item created', { itemId, userId, correlationId });
logger.error('Failed to publish event', { error: err.message, correlationId });
```

Log levels: `error`, `warn`, `info`, `debug`

All logs include:

- `timestamp`
- `level`
- `service` name
- `correlationId` (when passed)

---

## Environment Variables Reference

See the `.env.example` in each service directory for a complete list. Never commit real secrets to source control. Use [AWS Secrets Manager](../terraform/overview.md#rds-module) in cloud environments.
