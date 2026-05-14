/**
 * @file infrastructure/mock/historica.mock.js
 * @description Datos mock para calificación histórica (HU-61314) y reporte (HU-61568).
 */

export const HISTORICA_MOCK = [
  { id: 1, numeroAsamblea: '2024-01', tipoAsamblea: 'Ordinaria',      noExpediente: 'EXP-001234', noGestion: 'G-0045', dpi: '2265780540101', nombre: 'MENDOZA ARRIAGA CARLOS ROBERTO', estadoDesc: 'Aprobado',  fechaSolicitud: '15/03/2024' },
  { id: 2, numeroAsamblea: '2024-01', tipoAsamblea: 'Ordinaria',      noExpediente: 'EXP-001235', noGestion: '—',      dpi: '1234567890101', nombre: 'LOPEZ PÉREZ MARÍA ELENA',        estadoDesc: 'Denegado', fechaSolicitud: '15/03/2024' },
  { id: 3, numeroAsamblea: '2024-01', tipoAsamblea: 'Ordinaria',      noExpediente: 'EXP-001236', noGestion: 'G-0046', dpi: '9876543210101', nombre: 'CHEN WU CARLOS',                 estadoDesc: 'Aprobado',  fechaSolicitud: '15/03/2024' },
  { id: 4, numeroAsamblea: '2023-01', tipoAsamblea: 'Ordinaria',      noExpediente: 'EXP-000890', noGestion: 'G-0031', dpi: '2265780540101', nombre: 'MENDOZA ARRIAGA CARLOS ROBERTO', estadoDesc: 'Aprobado',  fechaSolicitud: '20/03/2023' },
  { id: 5, numeroAsamblea: '2024-02', tipoAsamblea: 'Extraordinaria', noExpediente: 'EXP-002001', noGestion: '—',      dpi: '3344556670202', nombre: 'RUIZ MORALES ANA PATRICIA',      estadoDesc: 'Denegado', fechaSolicitud: '10/09/2024' },
  { id: 6, numeroAsamblea: '2024-02', tipoAsamblea: 'Extraordinaria', noExpediente: 'EXP-002002', noGestion: 'G-0099', dpi: '7788990011202', nombre: 'FUENTES ALVARADO ROSA',          estadoDesc: 'Aprobado',  fechaSolicitud: '10/09/2024' },
];

/**
 * Registros del reporte ACCFRM0828 con campos nuevos (Hora + Estado Precalificación).
 * La fuente identifica qué rama del motor de clasificación la determinó.
 * @see HU-61568 Criterio #5
 */
export const REPORTE_MOCK = [
  { credencial: 'ACC-001', accionista: 'ACC-001 — MENDOZA ARRIAGA CARLOS ROBERTO', nombre: 'MENDOZA ARRIAGA CARLOS ROBERTO', sede: 'Central',  dpi: '2265780540101', fecha: '24/04/2026', hora: '08:12:34', propios: 45, ajenos: 12, totalVotosA: 57, totalVotos: 57, usuario: 'mgarcia', estadoDesc: 'Denegado',                          fuente: 'caso' },
  { credencial: 'ACC-002', accionista: 'ACC-002 — LOPEZ PÉREZ MARÍA ELENA',        nombre: 'LOPEZ PÉREZ MARÍA ELENA',        sede: 'Zona 4',   dpi: '1234567890101', fecha: '24/04/2026', hora: '08:25:11', propios: 30, ajenos:  0, totalVotosA: 30, totalVotos: 30, usuario: 'mgarcia', estadoDesc: 'Fallecido',                          fuente: 'caso' },
  { credencial: 'ACC-003', accionista: 'ACC-003 — CHEN WU CARLOS',                 nombre: 'CHEN WU CARLOS',                 sede: 'Central',  dpi: '9876543210101', fecha: '24/04/2026', hora: '09:01:05', propios: 15, ajenos:  5, totalVotosA: 20, totalVotos: 20, usuario: 'jperez',  estadoDesc: 'Aprobado',                           fuente: 'hist' },
  { credencial: 'ACC-004', accionista: 'ACC-004 — RUIZ MORALES ANA PATRICIA',      nombre: 'RUIZ MORALES ANA PATRICIA',      sede: 'Mixco',    dpi: '3344556670202', fecha: '24/04/2026', hora: '09:15:44', propios: 22, ajenos:  8, totalVotosA: 30, totalVotos: 30, usuario: 'jperez',  estadoDesc: 'Limitación Participación Asamblea', fuente: 'caso' },
  { credencial: 'ACC-005', accionista: 'ACC-005 — FUENTES ALVARADO ROSA',          nombre: 'FUENTES ALVARADO ROSA',          sede: 'Zona 4',   dpi: '7788990011202', fecha: '24/04/2026', hora: '09:30:22', propios: 18, ajenos:  2, totalVotosA: 20, totalVotos: 20, usuario: 'jperez',  estadoDesc: 'Aprobado',                           fuente: 'hist' },
  { credencial: 'ACC-006', accionista: 'ACC-006 — TORRES MENDEZ ROBERTO',          nombre: 'TORRES MENDEZ ROBERTO',          sede: 'Central',  dpi: '1122334455601', fecha: '24/04/2026', hora: '10:00:00', propios:  0, ajenos:  0, totalVotosA:  0, totalVotos:  0, usuario: 'mgarcia', estadoDesc: 'Nuevo',                              fuente: 'new'  },
  { credencial: 'ACC-007', accionista: 'ACC-007 — GOMEZ SANTA CRUZ LUIS',          nombre: 'GOMEZ SANTA CRUZ LUIS',          sede: 'Central',  dpi: '9988776655407', fecha: '24/04/2026', hora: '10:15:30', propios:  8, ajenos:  1, totalVotosA:  9, totalVotos:  9, usuario: 'mgarcia', estadoDesc: 'Nuevo',                              fuente: 'new'  },
];
