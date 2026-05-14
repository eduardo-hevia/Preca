/**
 * @file infrastructure/mock/estadosMockService.js
 * @description Store en memoria para estados — usado cuando VITE_USE_MOCK=true.
 * Misma interfaz que EstadosApi para transparencia en hooks.
 */
import { ESTADOS_MOCK, BITACORA_ESTADOS_MOCK } from './estados.mock.js';
import { VALIDACION, USUARIO_DEMO } from '../../core/constants/index.js';
import { normalize, nowString, crearEntradaBitacora } from '../../core/utils/index.js';

let _estados  = ESTADOS_MOCK.map(e => ({ ...e }));
let _bitacora = [...BITACORA_ESTADOS_MOCK];
let _nextId   = Math.max(..._estados.map(e => e.id)) + 1;

const EstadosServiceMock = {
  getAll:     () => [..._estados],
  getBitacora:() => [..._bitacora],

  getById: (id) => {
    const e = _estados.find(x => x.id === Number(id));
    if (!e) throw Object.assign(new Error(`Estado ${id} no encontrado.`), { code: 'NOT_FOUND', status: 404 });
    return e;
  },

  validate: (descripcion, excludeId = null) => {
    if (!descripcion?.trim()) return { valid: false, error: 'La descripción es obligatoria.' };
    if (descripcion.trim().length > VALIDACION.DESC_MAX_LENGTH) return { valid: false, error: `Máximo ${VALIDACION.DESC_MAX_LENGTH} caracteres.` };
    if (_estados.some(e => normalize(e.descripcion) === normalize(descripcion) && e.id !== excludeId))
      return { valid: false, error: 'Ya existe un estado con esa descripción.' };
    return { valid: true };
  },

  create: (descripcion) => {
    const desc = descripcion.trim();
    const dup  = _estados.some(e => normalize(e.descripcion) === normalize(desc));
    if (dup) throw Object.assign(new Error('Ya existe un estado con esa descripción.'), { code: 'ESTADO_DUPLICADO', status: 409 });
    const nuevo = { id: _nextId++, descripcion: desc, tipo: 'custom', modificadoEn: nowString(), usuario: USUARIO_DEMO };
    _estados.push(nuevo);
    _bitacora.unshift(crearEntradaBitacora({ usuario: USUARIO_DEMO, operacion: 'CREACIÓN', campo: '—', valorAnterior: '—', valorNuevo: desc, registroId: nuevo.id }));
    return nuevo;
  },

  update: (id, descripcion) => {
    const idx = _estados.findIndex(e => e.id === Number(id));
    if (idx === -1) throw Object.assign(new Error('Estado no encontrado.'), { code: 'NOT_FOUND', status: 404 });
    const anterior = _estados[idx].descripcion;
    const desc = descripcion.trim();
    const dup  = _estados.some(e => normalize(e.descripcion) === normalize(desc) && e.id !== Number(id));
    if (dup) throw Object.assign(new Error('Ya existe un estado con esa descripción.'), { code: 'ESTADO_DUPLICADO', status: 409 });
    _estados[idx] = { ..._estados[idx], descripcion: desc, modificadoEn: nowString(), usuario: USUARIO_DEMO };
    _bitacora.unshift(crearEntradaBitacora({ usuario: USUARIO_DEMO, operacion: 'ACTUALIZACIÓN', campo: 'Descripción', valorAnterior: anterior, valorNuevo: desc, registroId: Number(id) }));
    return _estados[idx];
  },

  search: (q) => {
    const n = normalize(q);
    return _estados.filter(e => normalize(e.descripcion).includes(n) || String(e.id).includes(q));
  },

  /** Resetea el store (útil en tests de vitest) */
  _reset: () => {
    _estados  = ESTADOS_MOCK.map(e => ({ ...e }));
    _bitacora = [...BITACORA_ESTADOS_MOCK];
    _nextId   = Math.max(..._estados.map(e => e.id)) + 1;
  },
};

export default EstadosServiceMock;
