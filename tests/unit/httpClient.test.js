/**
 * @file tests/unit/httpClient.test.js
 * @description Tests unitarios del cliente HTTP — interceptores, ApiError, retry.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request:  { use: vi.fn() },
          response: { use: vi.fn() },
        },
        get:    vi.fn(),
        post:   vi.fn(),
        put:    vi.fn(),
        delete: vi.fn(),
      })),
    },
  };
});

import { ApiError, setAuthToken, clearAuthToken } from '../../src/infrastructure/api/httpClient.js';

describe('ApiError', () => {
  it('es una instancia de Error', () => {
    const err = new ApiError('mensaje', 'CODIGO', 409, { campo: 'valor' });
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('expone message, code, status y details', () => {
    const err = new ApiError('Estado duplicado', 'ESTADO_DUPLICADO', 409, null);
    expect(err.message).toBe('Estado duplicado');
    expect(err.code).toBe('ESTADO_DUPLICADO');
    expect(err.status).toBe(409);
    expect(err.details).toBeNull();
  });

  it('name es "ApiError"', () => {
    expect(new ApiError('x').name).toBe('ApiError');
  });

  it('status por defecto es 500', () => {
    expect(new ApiError('error').status).toBe(500);
  });

  it('code por defecto es "UNKNOWN_ERROR"', () => {
    expect(new ApiError('error').code).toBe('UNKNOWN_ERROR');
  });

  it('se puede capturar con instanceof en catch', () => {
    const throwFn = () => { throw new ApiError('test', 'TEST', 400); };
    try { throwFn(); }
    catch (err) { expect(err instanceof ApiError).toBe(true); }
  });
});

describe('setAuthToken / clearAuthToken', () => {
  it('se pueden llamar sin errores', () => {
    expect(() => setAuthToken('token_test')).not.toThrow();
    expect(() => clearAuthToken()).not.toThrow();
  });
});
