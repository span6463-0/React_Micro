---
applyTo: 'API/**'
---

# API Microservices Instructions

## Service Structure

Each microservice follows this structure:

```
service-name/
├── src/
│   ├── index.js           # Entry point
│   ├── app.js             # Express app setup
│   ├── config/            # Environment config
│   ├── routes/            # Route definitions
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── models/            # Data models
│   ├── middleware/        # Custom middleware
│   ├── events/            # Kafka producers/consumers
│   └── utils/             # Helper functions
├── tests/                 # Test files
├── Dockerfile
└── package.json
```

## Express Patterns

```javascript
// Route definition
router.get('/:id', validateParams, controller.getById);

// Controller pattern
const getById = async (req, res, next) => {
  try {
    const result = await service.findById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Service pattern
const findById = async (id) => {
  return await db('table').where({ id }).first();
};
```

## Database Access

- Use Knex.js query builder
- Always use parameterized queries
- Use transactions for multi-table operations
- Handle connection pooling properly

## Kafka Events

```javascript
// Producer
await producer.send({
  topic: 'user.events',
  messages: [
    {
      key: userId,
      value: JSON.stringify({ type: 'USER_CREATED', data: user }),
    },
  ],
});

// Consumer
await consumer.subscribe({ topic: 'auth.events' });
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    await handleEvent(event);
  },
});
```

## Error Handling

- Use custom AppError class
- Include error codes for client handling
- Log with correlation ID from request headers
- Return consistent error response format

## Authentication Middleware

- Validate JWT on protected routes
- Extract user info to req.user
- Check API keys for service-to-service calls
- Rate limit by IP and user ID

## Health Checks

Every service must expose:

- `GET /health` - Basic liveness check
- `GET /health/ready` - Readiness with DB/Kafka checks
