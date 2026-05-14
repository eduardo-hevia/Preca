/**
 * @file modules/estados-precalificacion/services/estadosService.js
 * @description Capa de servicio para el catálogo de estados de precalificación.
 * Encapsula la lógica de negocio: validaciones, unicidad, generación de bitácora.
 * @see HU-61309
 *
 * En producción: reemplazar el store en memoria con llamadas HTTP (fetch/axios).
 */
import { ESTADOS_MOCK, BITACORA_ESTADOS_MOCK } from '../../../infrastructure/mock/estados.mock';
import { VALIDACION, USUARIO_DEMO } from '../../../core/constants';
import { normalize, nowString, crearEntradaBitacora } from '../../../core/utils';

/**
 * @typedef {{ id: number, descripcion: string, tipo: 'base'|'custom', modificadoEn: string, usuario: string }} EstadoPrecalificacion
 * @typedef {{ id: number, timestamp: string, usuario: string, operacion: string, campo: string, valorAnterior: string, valorNuevo: string, registroId: number }} EntradaBitacora
 */

// Store en memoria — simula persistencia durante la sesión
let _estados = [...ESTADOS_MOCK];
let _bitacora = [...BITACORA_ESTADOS_MOCK];
let _nextId = Math.max(..._estados.map((e) => e.id)) + 1;

const EstadosService = {
  /** Retorna todos los estados activos */
  getAll: () => [..._estados],

  /** Retorna la bitácora completa (más reciente primero) */
  getBitacora: () => [..._bitacora],

  /**
   * Valida la descripción antes de crear/actualizar.
   * @param {string} descripcion
   * @param {number|null} [excludeId] - ID a excluir en validación de unicidad (edición)
   * @returns {{ valid: boolean, error?: string }}
   */
  validate: (descripcion, excludeId = null) => {
    if (!descripcion || descripcion.trim().length === 0)
      return { valid: false, error: 'La descripción es obligatoria.' };

    if (descripcion.trim().length > VALIDACION.DESC_MAX_LENGTH)
      return { valid: false, error: `Máximo ${VALIDACION.DESC_MAX_LENGTH} caracteres.` };

    const dup = _estados.some(
      (e) => normalize(e.descripcion) === normalize(descripcion) && e.id !== excludeId,
    );
    if (dup)
      return { valid: false, error: 'Ya existe un estado con esa descripción (unicidad requerida).' };

    return { valid: true };
  },

  /**
   * Crea un nuevo estado y registra en bitácora.
   * @param {string} descripcion
   * @returns {EstadoPrecalificacion}
   */
  create: (descripcion) => {
    const nuevo = {
      id: _nextId++,
      descripcion: descripcion.trim(),
      tipo: 'custom',
      modificadoEn: nowString(),
      usuario: USUARIO_DEMO,
    };
    _estados.push(nuevo);
    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'CREACIÓN',
        campo: '—',
        valorAnterior: '—',
        valorNuevo: nuevo.descripcion,
        registroId: nuevo.id,
      }),
    );
    return nuevo;
  },

  /**
   * Actualiza la descripción de un estado existente y registra en bitácora.
   * @param {number} id
   * @param {string} descripcion
   * @returns {EstadoPrecalificacion|null}
   */
  update: (id, descripcion) => {
    const idx = _estados.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const anterior = _estados[idx].descripcion;
    _estados[idx] = {
      ..._estados[idx],
      descripcion: descripcion.trim(),
      modificadoEn: nowString(),
      usuario: USUARIO_DEMO,
    };
    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'ACTUALIZACIÓN',
        campo: 'Descripción',
        valorAnterior: anterior,
        valorNuevo: descripcion.trim(),
        registroId: id,
      }),
    );
    return _estados[idx];
  },

  /**
   * Filtra estados por query (búsqueda local en descripción y código)
   * @param {string} query
   * @returns {EstadoPrecalificacion[]}
   */
  search: (query) => {
    const q = normalize(query);
    return _estados.filter(
      (e) => normalize(e.descripcion).includes(q) || String(e.id).includes(q),
    );
  },
};

export default EstadosService;
