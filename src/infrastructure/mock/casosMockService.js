/**
 * @file infrastructure/mock/casosMockService.js
 * @description Store en memoria para casos especiales — VITE_USE_MOCK=true.
 */
import { CASOS_MOCK } from './casos.mock.js';
import { ESTADO_ID, USUARIO_DEMO } from '../../core/constants/index.js';
import { nowString, crearEntradaBitacora } from '../../core/utils/index.js';

let _casos  = CASOS_MOCK.map(c => ({ ...c }));
let _nextId = Math.max(..._casos.map(c => c.id)) + 1;

const CasosServiceMock = {
  getAll: () => _casos.filter(c => c.activo),

  getById: (id) => {
    const c = _casos.find(x => x.id === Number(id) && x.activo);
    if (!c) throw Object.assign(new Error('Caso no encontrado.'), { code: 'NOT_FOUND', status: 404 });
    return c;
  },

  validate: (tipoDocumento, numeroDocumento, excludeId = null) => {
    if (!tipoDocumento) return { valid: false, error: 'El tipo de documento es obligatorio.' };
    if (!numeroDocumento?.trim()) return { valid: false, error: 'El número de documento es obligatorio.' };
    const dup = _casos.some(c => c.activo && c.tipoDocumento === tipoDocumento && c.numeroDocumento === numeroDocumento.trim() && c.id !== excludeId);
    if (dup) return { valid: false, error: 'Ya existe un registro activo con ese tipo y número de documento.' };
    return { valid: true };
  },

  create: (payload) => {
    const { tipoDocumento, numeroDocumento, nombreCompleto, estadoId, fechaDefuncion } = payload;
    if (Number(estadoId) === ESTADO_ID.FALLECIDO && !fechaDefuncion)
      throw Object.assign(new Error('La fecha de defunción es obligatoria para estado Fallecido.'), { code: 'UNPROCESSABLE', status: 422 });
    const dup = _casos.some(c => c.activo && c.tipoDocumento === tipoDocumento && c.numeroDocumento === numeroDocumento?.trim());
    if (dup) throw Object.assign(new Error('Ya existe un registro activo con ese tipo y número de documento.'), { code: 'CASO_DUPLICADO', status: 409 });
    const nuevo = { id: _nextId++, tipoDocumento, numeroDocumento: numeroDocumento.trim(), nombreCompleto, estadoId: Number(estadoId), fechaDefuncion: fechaDefuncion || null, registradoEn: nowString().split(' ')[0], activo: true };
    _casos.push(nuevo);
    return nuevo;
  },

  update: (id, payload) => {
    const idx = _casos.findIndex(c => c.id === Number(id) && c.activo);
    if (idx === -1) throw Object.assign(new Error('Caso no encontrado.'), { code: 'NOT_FOUND', status: 404 });
    if (Number(payload.estadoId) === ESTADO_ID.FALLECIDO && !payload.fechaDefuncion)
      throw Object.assign(new Error('La fecha de defunción es obligatoria para estado Fallecido.'), { code: 'UNPROCESSABLE', status: 422 });
    _casos[idx] = { ..._casos[idx], ...payload };
    return _casos[idx];
  },

  softDelete: (id) => {
    const idx = _casos.findIndex(c => c.id === Number(id) && c.activo);
    if (idx === -1) throw Object.assign(new Error('Caso no encontrado.'), { code: 'NOT_FOUND', status: 404 });
    _casos[idx].activo = false;
    return { id: Number(id), eliminado: true };
  },

  _reset: () => {
    _casos  = CASOS_MOCK.map(c => ({ ...c }));
    _nextId = Math.max(..._casos.map(c => c.id)) + 1;
  },
};

export default CasosServiceMock;
