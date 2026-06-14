import { AppError } from '../utils/AppError.js';

export const validateApiKey = (expectedKey) => {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== expectedKey) {
      return next(new AppError('Invalid API key', 401, 'INVALID_API_KEY'));
    }
    
    next();
  };
};
