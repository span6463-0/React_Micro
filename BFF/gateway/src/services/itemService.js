import axios from 'axios';
import CircuitBreaker from 'opossum';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

const client = axios.create({
  baseURL: config.services.item,
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
      data: ['POST', 'PUT', 'PATCH'].includes(method) ? data : undefined,
      params: method === 'GET' ? data : undefined,
      headers: { 'X-Correlation-ID': correlationId },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new AppError(
        error.response.data?.error?.message || 'Item service error',
        error.response.status,
        error.response.data?.error?.code || 'ITEM_SERVICE_ERROR'
      );
    }
    throw new AppError('Item service unavailable', 503, 'SERVICE_UNAVAILABLE');
  }
};

const breaker = new CircuitBreaker(makeRequest, breakerOptions);

export const itemService = {
  getAll: (params, correlationId) =>
    breaker.fire('GET', '/items', params, correlationId),

  getById: (id, correlationId) =>
    breaker.fire('GET', `/items/${id}`, null, correlationId),

  create: (data, correlationId) =>
    breaker.fire('POST', '/items', data, correlationId),

  update: (id, data, correlationId) =>
    breaker.fire('PUT', `/items/${id}`, data, correlationId),

  delete: (id, correlationId) =>
    breaker.fire('DELETE', `/items/${id}`, null, correlationId),

  getStats: (userId, correlationId) =>
    breaker.fire('GET', `/items/stats/${userId}`, null, correlationId),
};
