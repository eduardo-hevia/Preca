/**
 * @file modules/reporte-expedientes/hooks/useReporte.js
 * @description Hook integrado con ReporteApi. @see HU-61568
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import ReporteApi from '../../../infrastructure/api/modules/reporteApi.js';

const EMPTY_FILTERS = { tipoAsamblea: 'Ordinaria', sede: '', estadoDesc: '' };
const INITIAL = { loading: false, error: null };

export const useReporte = () => {
  const [rows,    setRows]    = useState([]);
  const [resumen, setResumen] = useState({ desdeCasoEspecial: 0, desdeHistorica: 0, nuevo: 0 });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [async_,  setAsync]   = useState(INITIAL);

  const startLoad = () => setAsync({ loading: true, error: null });
  const setError  = (e) => setAsync({ loading: false, error: e });
  const clearAsync= () => setAsync(INITIAL);

  const loadReporte = useCallback(async (f = EMPTY_FILTERS) => {
    startLoad();
    try {
      const res = await ReporteApi.getReporte(f);
      setRows(res.data ?? []);
      setResumen(res.resumen ?? { desdeCasoEspecial: 0, desdeHistorica: 0, nuevo: 0 });
      clearAsync();
    } catch (err) { setError(err?.message ?? 'Error al generar reporte.'); }
  }, []);

  useEffect(() => { loadReporte(EMPTY_FILTERS); }, [loadReporte]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    loadReporte(newFilters);
  }, [loadReporte]);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    loadReporte(EMPTY_FILTERS);
  }, [loadReporte]);

  const exportExcel = useCallback(async () => {
    try { await ReporteApi.exportExcel(filters); }
    catch (err) { setError(err?.message ?? 'Error al exportar.'); }
  }, [filters]);

  return { rows, resumen, filters, asyncState: async_, applyFilters, resetFilters, exportExcel };
};
