/**
 * @file core/constants/index.js
 * @description Constantes globales de la aplicación.
 * Centraliza valores fijos — nunca usar magic strings en componentes.
 */

/** Tipos de documento válidos para accionistas */
export const TIPO_DOCUMENTO = {
  DPI: 'DPI',
  CEDULA: 'Cédula',
};

/** Tipos de asamblea según HU-61314 */
export const TIPO_ASAMBLEA = {
  ORDINARIA: 'Ordinaria',
  EXTRAORDINARIA: 'Extraordinaria',
  MIXTA: 'Mixta',
};

/** IDs de los 7 estados base (HU-61309) — preservar orden operativo */
export const ESTADO_ID = {
  APROBADO: 1,
  NUEVO: 2,
  DENEGADO: 3,
  ACCIONES_ANOMALAS: 4,
  REVOCADO: 5,
  FALLECIDO: 6,
  LIMITACION_ASAMBLEA: 7,
};

/**
 * Fuentes del motor de clasificación automática.
 * @see HU-61568 Criterio #5
 * Prioridad: CASO_ESPECIAL > HISTORICA > NUEVO
 */
export const FUENTE_CLASIFICACION = {
  CASO_ESPECIAL: 'caso',
  HISTORICA: 'hist',
  NUEVO: 'new',
};

/** Límites de validación según especificación HU-61309 */
export const VALIDACION = {
  DESC_MAX_LENGTH: 50,
};

/** Usuario de sesión demo */
export const USUARIO_DEMO = 'mgarcia';
