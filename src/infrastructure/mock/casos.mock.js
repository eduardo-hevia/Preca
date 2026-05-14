/**
 * @file infrastructure/mock/casos.mock.js
 * @description Datos mock para casos especiales de precalificación (HU-61310).
 */

export const CASOS_MOCK = [
  { id: 1, tipoDocumento: 'DPI',    numeroDocumento: '2265780540101', nombreCompleto: 'MENDOZA ARRIAGA CARLOS ROBERTO',  estadoId: 3, estadoDesc: 'Denegado',                          fechaDefuncion: null,         registradoEn: '10/04/2026', activo: true },
  { id: 2, tipoDocumento: 'DPI',    numeroDocumento: '1234567890101', nombreCompleto: 'LOPEZ PÉREZ MARÍA ELENA',         estadoId: 6, estadoDesc: 'Fallecido',                          fechaDefuncion: '12/01/2025', registradoEn: '11/04/2026', activo: true },
  { id: 3, tipoDocumento: 'Cédula', numeroDocumento: '9876543',       nombreCompleto: 'HERRERA CASTILLO JUAN ANTONIO',   estadoId: 5, estadoDesc: 'Revocado',                          fechaDefuncion: null,         registradoEn: '11/04/2026', activo: true },
  { id: 4, tipoDocumento: 'DPI',    numeroDocumento: '3344556670202', nombreCompleto: 'RUIZ MORALES ANA PATRICIA',       estadoId: 7, estadoDesc: 'Limitación Participación Asamblea', fechaDefuncion: null,         registradoEn: '12/04/2026', activo: true },
  { id: 5, tipoDocumento: 'DPI',    numeroDocumento: '5566778890303', nombreCompleto: 'GARCÍA LÓPEZ PEDRO PABLO',        estadoId: 4, estadoDesc: 'Acciones Adquiridas Anómalamente', fechaDefuncion: null,         registradoEn: '13/04/2026', activo: true },
];
