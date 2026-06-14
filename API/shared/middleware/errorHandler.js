import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const correlationId = req.correlationId || 'unknown';
  
  logger.error({
    correlationId,
    message: err.message,
    stack: err.stack,
    code: err.code,
    statusCode: err.statusCode,
  });
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  const code = err.code || 'INTERNAL_ERROR';
  
  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
};
