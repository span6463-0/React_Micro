export const config = {
  port: process.env.AUTH_API_PORT || 5001,
  db: {
    host: process.env.AUTH_DB_HOST || 'localhost',
    port: process.env.AUTH_DB_PORT || 5433,
    database: process.env.AUTH_DB_NAME || 'auth_db',
    user: process.env.AUTH_DB_USER || 'postgres',
    password: process.env.AUTH_DB_PASSWORD || 'postgres',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
    clientId: 'auth-api',
  },
  internalApiKey: process.env.INTERNAL_API_KEY || 'internal-key',
};
