/**
 * @file infrastructure/api/httpClient.js
 * @description Cliente HTTP Axios centralizado.
 * - Base URL desde VITE_API_BASE_URL
 * - Interceptor de request: adjunta JWT automáticamente
 * - Interceptor de response: normaliza errores de API → AppApiError
 * - Retry automático en 503/429 (1 reintento)
 */
import axios from 'axios';

/** Token almacenado en sesión (set por el módulo de auth) */
let _token = null;
export const setAuthToken = (token) => { _token = token; };
export const clearAuthToken = () => { _token = null; };

/** Error tipado de la API para manejo uniforme en los hooks */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {string} code
   * @param {number} status
   * @param {*} details
   */
  constructor(message, code = 'UNKNOWN_ERROR', status = 500, details = null) {
    super(message);
    this.code    = code;
    this.status  = status;
    this.details = details;
    this.name    = 'ApiError';
  }
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request interceptor: inyecta JWT ─────────────────── */
httpClient.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  // CX-006 FIX: Header requerido por el middleware CSRF del backend
  // Los navegadores no permiten este header en cross-origin requests sin CORS explícito
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

/* ── Response interceptor: normaliza errores ──────────── */
httpClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;

    // Reintento automático en 503/429 (1 vez)
    if (response?.status >= 500 && !config._retried) {
      config._retried = true;
      await new Promise((r) => setTimeout(r, 800));
      return httpClient(config);
    }

    if (response?.data) {
      const { message, code, details } = response.data;
      throw new ApiError(
        message ?? 'Error de servidor',
        code    ?? 'SERVER_ERROR',
        response.status,
        details,
      );
    }

    if (error.code === 'ECONNABORTED') {
      throw new ApiError('La solicitud tardó demasiado. Verifique su conexión.', 'TIMEOUT', 408);
    }

    throw new ApiError('No se pudo conectar al servidor.', 'NETWORK_ERROR', 0);
  },
);

export default httpClient;
