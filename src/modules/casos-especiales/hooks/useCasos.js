/**
 * @file modules/casos-especiales/hooks/useCasos.js
 * @description Hook integrado con CasosApi. @see HU-61310
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import CasosApi from '../../../infrastructure/api/modules/casosApi.js';

const INITIAL = { loading: false, error: null };

export const useCasos = () => {
  const [casos,        setCasos]        = useState([]);
  const [bitacora,     setBitacora]     = useState([]);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo,   setFilterTipo]   = useState('');
  const [async_,       setAsync]        = useState(INITIAL);

  const startLoad = () => setAsync({ loading: true,  error: null });
  const setError  = (e) => setAsync({ loading: false, error: e });
  const clearAsync= () => setAsync(INITIAL);

  const refresh = useCallback(async () => {
    startLoad();
    try {
      const [r1, r2] = await Promise.all([CasosApi.getAll(), CasosApi.getBitacora()]);
      setCasos(r1.data ?? []);
      setBitacora(r2.data ?? []);
      clearAsync();
    } catch (err) {
      setError(err?.message ?? 'Error al cargar casos.');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const validate = useCallback((tipo, numero, excludeId = null) => {
    if (!tipo) return { valid: false, error: 'Tipo de documento obligatorio.' };
    if (!numero?.trim()) return { valid: false, error: 'Número de documento obligatorio.' };
    const dup = casos.some(c => c.activo !== false && c.tipoDocumento === tipo && c.numeroDocumento === numero.trim() && c.id !== excludeId);
    if (dup) return { valid: false, error: 'Ya existe un registro activo con ese tipo y número.' };
    return { valid: true };
  }, [casos]);

  const create = useCallback(async (payload) => {
    startLoad();
    try {
      const res = await CasosApi.create(payload);
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error al crear caso.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    startLoad();
    try {
      const res = await CasosApi.update(id, payload);
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error al actualizar caso.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  const softDelete = useCallback(async (id) => {
    startLoad();
    try {
      const res = await CasosApi.softDelete(id);
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error al eliminar caso.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  const cargaMasiva = useCallback(async (file, operacion, onProgress) => {
    startLoad();
    try {
      const res = await CasosApi.cargaMasiva(file, operacion, onProgress);
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error en carga masiva.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  const filteredCasos = useMemo(() =>
    casos.filter(c => {
      const q = searchQuery.toLowerCase();
      return (!q || c.nombreCompleto?.toLowerCase().includes(q) || c.numeroDocumento?.includes(q))
          && (!filterEstado || c.estadoDesc === filterEstado)
          && (!filterTipo   || c.tipoDocumento === filterTipo);
    }),
  [casos, searchQuery, filterEstado, filterTipo]);

  return {
    casos, bitacora, searchQuery, filteredCasos, asyncState: async_,
    filterEstado, filterTipo,
    setSearchQuery, setFilterEstado, setFilterTipo,
    validate, create, update, softDelete, cargaMasiva, refresh,
  };
};
