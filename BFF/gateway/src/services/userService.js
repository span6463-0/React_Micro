import axios from 'axios';
import CircuitBreaker from 'opossum';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

const client = axios.create({
  baseURL: config.services.user,
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
      params: method === 'GET' ? data : undefined,
      headers: { 'X-Correlation-ID': correlationId },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new AppError(
        error.response.data?.error?.message || 'User service error',
        error.response.status,
        error.response.data?.error?.code || 'USER_SERVICE_ERROR'
      );
    }
    throw new AppError('User service unavailable', 503, 'SERVICE_UNAVAILABLE');
  }
};

const breaker = new CircuitBreaker(makeRequest, breakerOptions);

export const userService = {
  getAll: (params, correlationId) =>
    breaker.fire('GET', '/users', params, correlationId),

  getById: (id, correlationId) =>
    breaker.fire('GET', `/users/${id}`, null, correlationId),

  update: (id, data, correlationId) =>
    breaker.fire('PUT', `/users/${id}`, data, correlationId),

  delete: (id, correlationId) =>
    breaker.fire('DELETE', `/users/${id}`, null, correlationId),
};
