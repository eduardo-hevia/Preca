/**
 * @file core/utils/index.js
 * @description Utilidades puras reutilizables (sin side-effects).
 * Funciones de formato, validación y transformación de datos.
 */

/**
 * Formatea un Date o string a DD/MM/YYYY HH:mm
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatea hora a HH:mm:ss (campo nuevo ACCFRM0828)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Formatea un número con padding de ceros a la izquierda
 * @param {number} n
 * @param {number} [pad=3]
 * @returns {string}
 */
export const padId = (n, pad = 3) => String(n).padStart(pad, '0');

/**
 * Verifica si una cadena está vacía o solo tiene espacios
 * @param {string} val
 * @returns {boolean}
 */
export const isEmpty = (val) => !val || val.trim().length === 0;

/**
 * Genera timestamp actual como string legible
 * @returns {string}
 */
export const nowString = () => formatDateTime(new Date());

/**
 * Normaliza texto a minúsculas sin acentos para comparaciones de unicidad
 * @param {string} str
 * @returns {string}
 */
export const normalize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Crea una entrada de bitácora estándar
 * @param {object} params
 * @param {string} params.usuario
 * @param {'CREACIÓN'|'ACTUALIZACIÓN'|'ELIMINACIÓN'} params.operacion
 * @param {string} params.campo
 * @param {string} params.valorAnterior
 * @param {string} params.valorNuevo
 * @param {number} params.registroId
 * @returns {object}
 */
export const crearEntradaBitacora = ({
  usuario,
  operacion,
  campo,
  valorAnterior,
  valorNuevo,
  registroId,
}) => ({
  id: Date.now(),
  timestamp: nowString(),
  usuario,
  operacion,
  campo,
  valorAnterior,
  valorNuevo,
  registroId,
});
