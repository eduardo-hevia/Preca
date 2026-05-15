/**
 * @file infrastructure/api/modules/casosApi.js
 * @description Llamadas HTTP al backend para HU-61310.
 */
import httpClient from '../httpClient.js';
import CasosServiceMock from '../../mock/casosMockService.js';
import { AUTH_MODE } from '../../auth/authConfig.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || AUTH_MODE === 'proto';

const CasosApi = {
  /** GET /casos con filtros y paginación */
  getAll: (params = {}) =>
    USE_MOCK
      ? Promise.resolve({ data: CasosServiceMock.getAll(), pagination: { total: CasosServiceMock.getAll().length, page: 1, limit: 20, pages: 1 } })
      : httpClient.get('/casos', { params }).then((r) => r.data),

  getById: (id) =>
    USE_MOCK
      ? Promise.resolve({ data: CasosServiceMock.getById(id) })
      : httpClient.get(`/casos/${id}`).then((r) => r.data),

  create: (payload) =>
    USE_MOCK
      ? Promise.resolve({ data: CasosServiceMock.create(payload) })
      : httpClient.post('/casos', payload).then((r) => r.data),

  update: (id, payload) =>
    USE_MOCK
      ? Promise.resolve({ data: CasosServiceMock.update(id, payload) })
      : httpClient.put(`/casos/${id}`, payload).then((r) => r.data),

  /** DELETE /casos/:id — eliminación lógica */
  softDelete: (id) =>
    USE_MOCK
      ? Promise.resolve({ data: CasosServiceMock.softDelete(id) })
      : httpClient.delete(`/casos/${id}`).then((r) => r.data),

  /**
   * POST /casos/carga-masiva — multipart/form-data
   * @param {File} file - Archivo .xlsx
   * @param {'reemplazo_total'|'incremental'} operacion
   * @param {(pct: number) => void} [onProgress]
   */
  cargaMasiva: (file, operacion = 'reemplazo_total', onProgress) => {
    if (USE_MOCK) {
      return Promise.resolve({ data: { exitosos: 2, rechazados: 1, errores: [{ fila: 3, errores: ['TIPO_DOCUMENTO inválido'] }] } });
    }
    const form = new FormData();
    form.append('archivo', file);
    form.append('operacion', operacion);
    return httpClient.post('/casos/carga-masiva', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }).then((r) => r.data);
  },

  getBitacora: (limit = 50) =>
    USE_MOCK
      ? Promise.resolve({ data: [] })
      : httpClient.get('/casos/bitacora', { params: { limit } }).then((r) => r.data),
};

export default CasosApi;
