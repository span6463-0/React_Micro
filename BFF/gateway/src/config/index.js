export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.BFF_PORT || 4000,
  
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  services: {
    auth: process.env.AUTH_API_URL || 'http://localhost:3001',
    user: process.env.USER_API_URL || 'http://localhost:3002',
    item: process.env.ITEM_API_URL || 'http://localhost:3003',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  
  internalApiKey: process.env.INTERNAL_API_KEY || 'internal-api-key-change-in-production',
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  
  circuitBreaker: {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
  },
};
