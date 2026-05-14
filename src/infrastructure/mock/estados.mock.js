/**
 * @file infrastructure/mock/estados.mock.js
 * @description Datos mock para estados de precalificación.
 * Seeds controlados según HU-61309 — 7 estados base obligatorios.
 * En producción: reemplazar con llamadas al API/backend.
 */
import { ESTADO_ID } from '../../core/constants';

/** @type {Array<import('../../modules/estados-precalificacion/services/estadosService').EstadoPrecalificacion>} */
export const ESTADOS_MOCK = [
  { id: ESTADO_ID.APROBADO,           descripcion: 'Aprobado',                          tipo: 'base', modificadoEn: '14/04/2026 08:12', usuario: 'admin' },
  { id: ESTADO_ID.NUEVO,              descripcion: 'Nuevo',                             tipo: 'base', modificadoEn: '14/04/2026 08:12', usuario: 'admin' },
  { id: ESTADO_ID.DENEGADO,           descripcion: 'Denegado',                          tipo: 'base', modificadoEn: '14/04/2026 08:12', usuario: 'admin' },
  { id: ESTADO_ID.ACCIONES_ANOMALAS,  descripcion: 'Acciones Adquiridas Anómalamente',  tipo: 'base', modificadoEn: '14/04/2026 09:45', usuario: 'mgarcia' },
  { id: ESTADO_ID.REVOCADO,           descripcion: 'Revocado',                          tipo: 'base', modificadoEn: '14/04/2026 08:12', usuario: 'admin' },
  { id: ESTADO_ID.FALLECIDO,          descripcion: 'Fallecido',                         tipo: 'base', modificadoEn: '15/04/2026 11:03', usuario: 'mgarcia' },
  { id: ESTADO_ID.LIMITACION_ASAMBLEA,descripcion: 'Limitación Participación Asamblea', tipo: 'base', modificadoEn: '15/04/2026 11:30', usuario: 'mgarcia' },
];

/** Bitácora inicial con eventos históricos de muestra */
export const BITACORA_ESTADOS_MOCK = [
  { id: 1, timestamp: '24/04/2026 09:15', usuario: 'mgarcia', operacion: 'ACTUALIZACIÓN', campo: 'Descripción', valorAnterior: 'Fallecido (viejo)', valorNuevo: 'Fallecido',                          registroId: 6 },
  { id: 2, timestamp: '24/04/2026 08:55', usuario: 'mgarcia', operacion: 'CREACIÓN',      campo: '—',            valorAnterior: '—',                   valorNuevo: 'Limitación Participación Asamblea', registroId: 7 },
  { id: 3, timestamp: '23/04/2026 16:40', usuario: 'admin',   operacion: 'ACTUALIZACIÓN', campo: 'Descripción', valorAnterior: 'Acciones Anomalas',   valorNuevo: 'Acciones Adquiridas Anómalamente',  registroId: 4 },
];
