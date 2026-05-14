/**
 * @file modules/calificacion-historica/hooks/useHistorica.js
 * @description Hook integrado con HistoricaApi. @see HU-61314
 */
import { useState, useCallback, useEffect } from 'react';
import HistoricaApi from '../../../infrastructure/api/modules/historicaApi.js';

const EMPTY_FILTERS = { numeroAsamblea: '', tipoAsamblea: '', dpi: '', estadoDesc: '' };
const INITIAL = { loading: false, error: null };

export const useHistorica = () => {
  const [registros, setRegistros] = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [bitacora,  setBitacora]  = useState([]);
  const [filters,   setFilters]   = useState(EMPTY_FILTERS);
  const [async_,    setAsync]     = useState(INITIAL);

  const startLoad = () => setAsync({ loading: true, error: null });
  const setError  = (e) => setAsync({ loading: false, error: e });
  const clearAsync= () => setAsync(INITIAL);

  const refresh = useCallback(async () => {
    startLoad();
    try {
      const [r1, r2] = await Promise.all([HistoricaApi.getAll(), HistoricaApi.getBitacora()]);
      setRegistros(r1.data ?? []);
      setFiltered(r1.data ?? []);
      setBitacora(r2.data ?? []);
      clearAsync();
    } catch (err) { setError(err?.message ?? 'Error al cargar histórica.'); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const applyFilters = useCallback(async (newFilters) => {
    startLoad();
    setFilters(newFilters);
    try {
      const r = await HistoricaApi.getAll(newFilters);
      setFiltered(r.data ?? []);
      clearAsync();
    } catch (err) { setError(err?.message ?? 'Error al filtrar.'); }
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setFiltered(registros);
  }, [registros]);

  const cargaMasiva = useCallback(async (file, opts, onProgress) => {
    startLoad();
    try {
      const res = await HistoricaApi.cargaMasiva(file, opts, onProgress);
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error en carga masiva.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  return { registros, filtered, bitacora, filters, asyncState: async_, applyFilters, resetFilters, cargaMasiva, refresh };
};
