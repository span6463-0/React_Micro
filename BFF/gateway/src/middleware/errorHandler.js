import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  const correlationId = req.correlationId || 'unknown';
  
  // Log error
  logger.error({
    correlationId,
    message: err.message,
    stack: err.stack,
    code: err.code,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
  });
  
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.code || 'INTERNAL_ERROR';
  
  // Don't expose internal errors in production
  if (config.nodeEnv === 'production' && statusCode === 500) {
    message = 'Internal server error';
    code = 'INTERNAL_ERROR';
  }
  
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};
