import { clsx } from 'clsx';

/**
 * Utility for constructing className strings conditionally
 * Combines clsx for conditional classes
 */
export const cn = (...inputs) => {
  return clsx(inputs);
};
