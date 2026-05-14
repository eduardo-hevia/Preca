/**
 * @file modules/reporte-expedientes/services/reporteService.js
 * @description Motor de clasificación automática de precalificación + generación de reporte.
 *
 * Reglas de clasificación (HU-61568 Criterio #5) — PRIORIDAD ESTRICTA:
 *   1. Si DPI ∈ CasosEspeciales → estado del caso especial (máxima prioridad)
 *   2. Si DPI ∈ CalHistórica (última asamblea del mismo tipo) → estado histórico
 *   3. Default → "Nuevo"
 */
import { REPORTE_MOCK } from '../../../infrastructure/mock/historica.mock';
import { FUENTE_CLASIFICACION } from '../../../core/constants';
import CasosService   from '../../casos-especiales/services/casosService';
import HistoricaService from '../../calificacion-historica/services/historicaService';

const ReporteService = {
  /**
   * Devuelve datos del reporte para una asamblea dada.
   * En el prototipo retorna datos mock + recalcula la columna de estado.
   * En producción: consultar endpoint con numeroAsamblea + tipoAsamblea.
   * @param {{ numeroAsamblea?: string, tipoAsamblea?: string, sede?: string, estadoDesc?: string }} filters
   * @returns {object[]}
   */
  getReporte: (filters = {}) => {
    let rows = [...REPORTE_MOCK];

    // Re-clasificar cada fila usando el motor de reglas en tiempo de ejecución
    const casos     = CasosService.getAll();
    const historica = HistoricaService.getAll();

    rows = rows.map((row) => {
      const casoEspecial = casos.find(
        (c) => c.activo && c.numeroDocumento === row.dpi,
      );

      if (casoEspecial) {
        return { ...row, estadoDesc: casoEspecial.estadoDesc, fuente: FUENTE_CLASIFICACION.CASO_ESPECIAL };
      }

      // Última asamblea del mismo tipo para cruce histórico
      const tipoFiltro = filters.tipoAsamblea ?? 'Ordinaria';
      const asambleasTipo = historica
        .filter((h) => h.tipoAsamblea === tipoFiltro)
        .sort((a, b) => b.numeroAsamblea.localeCompare(a.numeroAsamblea));

      const ultimaAsamblea = asambleasTipo[0]?.numeroAsamblea;
      const registroHist   = historica.find(
        (h) => h.dpi === row.dpi && h.numeroAsamblea === ultimaAsamblea,
      );

      if (registroHist) {
        return { ...row, estadoDesc: registroHist.estadoDesc, fuente: FUENTE_CLASIFICACION.HISTORICA };
      }

      return { ...row, estadoDesc: 'Nuevo', fuente: FUENTE_CLASIFICACION.NUEVO };
    });

    // Aplicar filtros opcionales de pantalla
    if (filters.sede)       rows = rows.filter((r) => r.sede === filters.sede);
    if (filters.estadoDesc) rows = rows.filter((r) => r.estadoDesc === filters.estadoDesc);

    return rows;
  },

  /** Resumen de fuentes para el panel del motor de clasificación */
  getSummary: (rows) => ({
    desdeCasoEspecial: rows.filter((r) => r.fuente === FUENTE_CLASIFICACION.CASO_ESPECIAL).length,
    desdeHistorica:    rows.filter((r) => r.fuente === FUENTE_CLASIFICACION.HISTORICA).length,
    nuevo:             rows.filter((r) => r.fuente === FUENTE_CLASIFICACION.NUEVO).length,
  }),
};

export default ReporteService;
