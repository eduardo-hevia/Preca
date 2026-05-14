/**
 * @file modules/estados-precalificacion/hooks/useEstados.js
 * @description Hook principal — integrado con EstadosApi, manejo de errores API.
 * @see HU-61309
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import EstadosApi from '../../../infrastructure/api/modules/estadosApi.js';
import { normalize } from '../../../core/utils/index.js';

const INITIAL = { loading: false, error: null };

export const useEstados = () => {
  const [estados,     setEstados]     = useState([]);
  const [bitacora,    setBitacora]    = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [async_,      setAsync]       = useState(INITIAL);

  const startLoad = () => setAsync({ loading: true,  error: null });
  const setError  = (e) => setAsync({ loading: false, error: e });
  const clearAsync= () => setAsync(INITIAL);

  const refresh = useCallback(async () => {
    startLoad();
    try {
      const [r1, r2] = await Promise.all([EstadosApi.getAll(), EstadosApi.getBitacora()]);
      setEstados(r1.data ?? []);
      setBitacora(r2.data ?? []);
      clearAsync();
    } catch (err) {
      setError(err?.message ?? 'Error al cargar estados.');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const validate = useCallback((descripcion, excludeId = null) => {
    if (!descripcion?.trim()) return { valid: false, error: 'La descripción es obligatoria.' };
    if (descripcion.trim().length > 50) return { valid: false, error: 'Máximo 50 caracteres.' };
    const dup = estados.some(e => normalize(e.descripcion) === normalize(descripcion) && e.id !== excludeId);
    if (dup) return { valid: false, error: 'Ya existe un estado con esa descripción.' };
    return { valid: true };
  }, [estados]);

  const create = useCallback(async (descripcion) => {
    startLoad();
    try {
      const res = await EstadosApi.create({ descripcion });
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error al crear estado.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  const update = useCallback(async (id, descripcion) => {
    startLoad();
    try {
      const res = await EstadosApi.update(id, { descripcion });
      await refresh();
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.message ?? 'Error al actualizar estado.';
      setError(msg);
      return { ok: false, error: msg, code: err?.code };
    }
  }, [refresh]);

  const filteredEstados = useMemo(() => {
    if (!searchQuery.trim()) return estados;
    const q = normalize(searchQuery);
    return estados.filter(e => normalize(e.descripcion).includes(q) || String(e.id).includes(searchQuery));
  }, [estados, searchQuery]);

  return { estados, bitacora, searchQuery, filteredEstados, asyncState: async_, setSearchQuery, validate, create, update, refresh };
};
