/**
 * @file infrastructure/api/modules/reporteApi.js
 * @description Llamadas HTTP al backend para HU-61568.
 */
import httpClient from '../httpClient.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let _mock = null;
const getMock = async () => {
  if (!_mock) _mock = await import('../../mock/historica.mock.js');
  return _mock;
};

const ReporteApi = {
  getReporte: async (params = {}) => {
    if (USE_MOCK) {
      const { REPORTE_MOCK } = await getMock();
      return {
        data: REPORTE_MOCK,
        resumen: {
          desdeCasoEspecial: REPORTE_MOCK.filter(r => r.fuente === 'caso').length,
          desdeHistorica:    REPORTE_MOCK.filter(r => r.fuente === 'hist').length,
          nuevo:             REPORTE_MOCK.filter(r => r.fuente === 'new').length,
        },
        pagination: { total: REPORTE_MOCK.length, page: 1, limit: 100, pages: 1 },
      };
    }
    return httpClient.get('/reporte/expedientes', { params }).then((r) => r.data);
  },

  exportExcel: (params = {}) => {
    if (USE_MOCK) return Promise.resolve(null);
    return httpClient.get('/reporte/expedientes/export/excel', {
      params,
      responseType: 'blob',
    }).then((r) => {
      const url  = URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `Reporte_ACCFRM0828_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  },

  clasificarDpi: (dpi, tipoAsamblea) =>
    USE_MOCK
      ? Promise.resolve({ data: { dpi, tipoAsamblea, estadoId: 2, estadoDescripcion: 'Nuevo', fuente: 'nuevo', detalle: {} } })
      : httpClient.post('/reporte/clasificar-dpi', { dpi, tipoAsamblea }).then((r) => r.data),
};

export default ReporteApi;
