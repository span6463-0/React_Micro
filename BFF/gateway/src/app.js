import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { correlationId } from './middleware/correlationId.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import itemRoutes from './routes/items.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(morgan('combined'));

// Custom middleware
app.use(correlationId);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/health/ready', async (req, res) => {
  const checkService = async (name, url) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(`${url}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      return { [name]: response.ok ? 'up' : 'degraded' };
    } catch {
      return { [name]: 'down' };
    }
  };

  const [auth, user, item] = await Promise.all([
    checkService('auth', config.services.auth),
    checkService('user', config.services.user),
    checkService('item', config.services.item),
  ]);

  const services = { ...auth, ...user, ...item };
  const allUp = Object.values(services).every((s) => s === 'up');

  res.status(allUp ? 200 : 503).json({
    status: allUp ? 'ready' : 'degraded',
    services,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Resource not found' },
  });
});

// Error handler
app.use(errorHandler);

export default app;
