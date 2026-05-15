/**
 * @file infrastructure/api/modules/estadosApi.js
 * @description Llamadas HTTP al backend para HU-61309.
 * Cuando VITE_USE_MOCK=true → usa el store en memoria (sin red).
 */
import httpClient from '../httpClient.js';
import EstadosServiceMock from '../../mock/estadosMockService.js';
import { AUTH_MODE } from '../../auth/authConfig.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || AUTH_MODE === 'proto';

const EstadosApi = {
  /** GET /estados → lista completa de estados activos */
  getAll: () =>
    USE_MOCK
      ? Promise.resolve({ data: EstadosServiceMock.getAll() })
      : httpClient.get('/estados').then((r) => r.data),

  /** GET /estados/:id */
  getById: (id) =>
    USE_MOCK
      ? Promise.resolve({ data: EstadosServiceMock.getById(id) })
      : httpClient.get(`/estados/${id}`).then((r) => r.data),

  /**
   * POST /estados
   * @param {{ descripcion: string }} payload
   */
  create: (payload) =>
    USE_MOCK
      ? Promise.resolve({ data: EstadosServiceMock.create(payload.descripcion) })
      : httpClient.post('/estados', payload).then((r) => r.data),

  /**
   * PUT /estados/:id
   * @param {number} id
   * @param {{ descripcion: string }} payload
   */
  update: (id, payload) =>
    USE_MOCK
      ? Promise.resolve({ data: EstadosServiceMock.update(id, payload.descripcion) })
      : httpClient.put(`/estados/${id}`, payload).then((r) => r.data),

  /** GET /estados/bitacora */
  getBitacora: (limit = 50) =>
    USE_MOCK
      ? Promise.resolve({ data: EstadosServiceMock.getBitacora() })
      : httpClient.get('/estados/bitacora', { params: { limit } }).then((r) => r.data),
};

export default EstadosApi;
