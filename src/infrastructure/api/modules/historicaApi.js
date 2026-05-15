/**
 * @file infrastructure/api/modules/historicaApi.js
 * @description Llamadas HTTP al backend para HU-61314.
 */
import httpClient from '../httpClient.js';
import { AUTH_MODE } from '../../auth/authConfig.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || AUTH_MODE === 'proto';
// Importación lazy del mock para evitar cargar datos en producción
let _mock = null;
const getMock = async () => {
  if (!_mock) _mock = await import('../../mock/historica.mock.js');
  return _mock;
};

const HistoricaApi = {
  getAll: async (params = {}) => {
    if (USE_MOCK) {
      const { HISTORICA_MOCK } = await getMock();
      return { data: HISTORICA_MOCK, pagination: { total: HISTORICA_MOCK.length, page: 1, limit: 50, pages: 1 } };
    }
    return httpClient.get('/historica', { params }).then((r) => r.data);
  },

  getAsambleas: async () => {
    if (USE_MOCK) {
      const { HISTORICA_MOCK } = await getMock();
      const unique = [...new Map(HISTORICA_MOCK.map(r => [r.numeroAsamblea, { numeroAsamblea: r.numeroAsamblea, tipoAsamblea: r.tipoAsamblea }])).values()];
      return { data: unique };
    }
    return httpClient.get('/historica/asambleas').then((r) => r.data);
  },

  cargaMasiva: (file, opts, onProgress) => {
    if (USE_MOCK) {
      return Promise.resolve({ data: { exitosos: 42, rechazados: 2, errores: [{ fila: 5, errores: ['DPI vacío'] }] } });
    }
    const form = new FormData();
    form.append('archivo', file);
    form.append('numeroAsamblea', opts.numeroAsamblea);
    form.append('tipoAsamblea',   opts.tipoAsamblea);
    form.append('modoReemplazo',  String(opts.modoReemplazo ?? false));
    return httpClient.post('/historica/carga-masiva', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }).then((r) => r.data);
  },

  getBitacora: (limit = 50) =>
    USE_MOCK
      ? Promise.resolve({ data: [] })
      : httpClient.get('/historica/bitacora', { params: { limit } }).then((r) => r.data),
};

export default HistoricaApi;
