import axios from 'axios';
import CircuitBreaker from 'opossum';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

const client = axios.create({
  baseURL: config.services.auth,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': config.internalApiKey,
  },
});

const breakerOptions = {
  timeout: config.circuitBreaker.timeout,
  errorThresholdPercentage: config.circuitBreaker.errorThresholdPercentage,
  resetTimeout: config.circuitBreaker.resetTimeout,
};

const makeRequest = async (method, url, data, correlationId) => {
  try {
    const response = await client({
      method,
      url,
      data,
      headers: { 'X-Correlation-ID': correlationId },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new AppError(
        error.response.data?.error?.message || 'Auth service error',
        error.response.status,
        error.response.data?.error?.code || 'AUTH_SERVICE_ERROR'
      );
    }
    throw new AppError('Auth service unavailable', 503, 'SERVICE_UNAVAILABLE');
  }
};

const breaker = new CircuitBreaker(makeRequest, breakerOptions);

breaker.on('open', () => console.warn('Auth service circuit breaker opened'));
breaker.on('halfOpen', () => console.info('Auth service circuit breaker half-open'));
breaker.on('close', () => console.info('Auth service circuit breaker closed'));

export const authService = {
  login: (email, password, correlationId) =>
    breaker.fire('POST', '/auth/login', { email, password }, correlationId),

  register: (name, email, password, correlationId) =>
    breaker.fire('POST', '/auth/register', { name, email, password }, correlationId),

  refresh: (refreshToken, correlationId) =>
    breaker.fire('POST', '/auth/refresh', { refreshToken }, correlationId),

  logout: (refreshToken, correlationId) =>
    breaker.fire('POST', '/auth/logout', { refreshToken }, correlationId),

  getMe: (userId, correlationId) =>
    breaker.fire('GET', `/auth/users/${userId}`, null, correlationId),
};
