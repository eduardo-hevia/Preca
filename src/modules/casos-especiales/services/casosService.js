/**
 * @file modules/casos-especiales/services/casosService.js
 * @description Servicio para gestión de casos especiales de precalificación.
 * Reglas de negocio: unicidad tipo+número, soft-delete, carga masiva simulada.
 * @see HU-61310
 */
import { CASOS_MOCK } from '../../../infrastructure/mock/casos.mock';
import { USUARIO_DEMO, ESTADO_ID } from '../../../core/constants';
import { nowString, crearEntradaBitacora } from '../../../core/utils';

let _casos    = [...CASOS_MOCK];
let _bitacora = [];
let _nextId   = Math.max(..._casos.map((c) => c.id)) + 1;

const CasosService = {
  /** Retorna todos los casos activos */
  getAll: () => _casos.filter((c) => c.activo),

  /** Retorna bitácora del módulo */
  getBitacora: () => [..._bitacora],

  /**
   * Valida unicidad de tipo+número entre registros activos.
   * @param {string} tipoDocumento
   * @param {string} numeroDocumento
   * @param {number|null} excludeId
   * @returns {{ valid: boolean, error?: string }}
   */
  validate: (tipoDocumento, numeroDocumento, excludeId = null) => {
    if (!tipoDocumento) return { valid: false, error: 'El tipo de documento es obligatorio.' };
    if (!numeroDocumento?.trim()) return { valid: false, error: 'El número de documento es obligatorio.' };

    const dup = _casos.some(
      (c) =>
        c.activo &&
        c.tipoDocumento === tipoDocumento &&
        c.numeroDocumento === numeroDocumento.trim() &&
        c.id !== excludeId,
    );
    if (dup)
      return { valid: false, error: 'Ya existe un registro activo con ese tipo y número de documento.' };

    return { valid: true };
  },

  /**
   * Crea un caso especial individual.
   * @param {object} payload
   */
  create: (payload) => {
    const nuevo = {
      id: _nextId++,
      ...payload,
      numeroDocumento: payload.numeroDocumento.trim(),
      registradoEn: nowString(),
      activo: true,
    };
    _casos.push(nuevo);
    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'CREACIÓN',
        campo: 'Registro',
        valorAnterior: '—',
        valorNuevo: `${nuevo.tipoDocumento} ${nuevo.numeroDocumento}`,
        registroId: nuevo.id,
      }),
    );
    return nuevo;
  },

  /**
   * Actualiza un caso especial.
   * @param {number} id
   * @param {object} payload
   */
  update: (id, payload) => {
    const idx = _casos.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const anterior = `${_casos[idx].tipoDocumento} ${_casos[idx].numeroDocumento}`;
    _casos[idx] = { ..._casos[idx], ...payload, modificadoEn: nowString() };
    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'ACTUALIZACIÓN',
        campo: 'Registro',
        valorAnterior: anterior,
        valorNuevo: `${_casos[idx].tipoDocumento} ${_casos[idx].numeroDocumento}`,
        registroId: id,
      }),
    );
    return _casos[idx];
  },

  /**
   * Eliminación lógica — no elimina físicamente (HU-61310 regla).
   * @param {number} id
   */
  softDelete: (id) => {
    const idx = _casos.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const desc = `${_casos[idx].tipoDocumento} ${_casos[idx].numeroDocumento}`;
    _casos[idx].activo = false;
    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'ELIMINACIÓN LÓGICA',
        campo: 'activo',
        valorAnterior: 'true',
        valorNuevo: 'false',
        registroId: id,
      }),
    );
    return true;
  },

  /**
   * Simula carga masiva (reemplazo total):
   * 1) Soft-delete de todos los activos
   * 2) Inserta nuevos registros
   * @param {object[]} rows - filas del Excel simulado
   * @returns {{ exitosos: number, rechazados: number, errores: string[] }}
   */
  cargaMasiva: (rows) => {
    // Paso 1: soft-delete total
    _casos.forEach((c) => { c.activo = false; });

    let exitosos = 0;
    const errores = [];

    rows.forEach((row, i) => {
      if (!row.tipoDocumento || !row.numeroDocumento) {
        errores.push(`Fila ${i + 2}: tipo o número de documento vacío.`);
        return;
      }
      _casos.push({
        id: _nextId++,
        ...row,
        registradoEn: nowString(),
        activo: true,
      });
      exitosos++;
    });

    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'CARGA MASIVA',
        campo: 'Múltiples registros',
        valorAnterior: '—',
        valorNuevo: `${exitosos} registros cargados`,
        registroId: 0,
      }),
    );

    return { exitosos, rechazados: errores.length, errores };
  },
};

export default CasosService;
