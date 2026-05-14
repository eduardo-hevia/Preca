/**
 * @file tests/setup.js
 * @description Setup global de Vitest — importa jest-dom matchers.
 */
import '@testing-library/jest-dom';

// Mock de import.meta.env para tests
Object.defineProperty(import.meta, 'env', {
  value: { VITE_USE_MOCK: 'true', VITE_API_BASE_URL: 'http://localhost:3001/api/v1' },
  writable: true,
});
