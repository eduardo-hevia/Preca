/**
 * @file modules/calificacion-historica/services/historicaService.js
 * @description Servicio de calificación histórica.
 * Solo lectura + carga masiva. No existe CRUD individual.
 * Validación de duplicidad: DPI + numeroAsamblea.
 * @see HU-61314
 */
import { HISTORICA_MOCK } from '../../../infrastructure/mock/historica.mock';
import { USUARIO_DEMO } from '../../../core/constants';
import { normalize, nowString, crearEntradaBitacora } from '../../../core/utils';

let _registros = [...HISTORICA_MOCK];
let _bitacora  = [];
let _nextId    = Math.max(..._registros.map((r) => r.id)) + 1;

const HistoricaService = {
  getAll: () => [..._registros],
  getBitacora: () => [..._bitacora],

  /**
   * Filtra registros por múltiples criterios dinámicos.
   * @param {{ numeroAsamblea?: string, tipoAsamblea?: string, dpi?: string, estadoDesc?: string }} filters
   */
  search: (filters) => {
    return _registros.filter((r) => {
      if (filters.numeroAsamblea && !r.numeroAsamblea.includes(filters.numeroAsamblea)) return false;
      if (filters.tipoAsamblea  && r.tipoAsamblea !== filters.tipoAsamblea)             return false;
      if (filters.dpi           && !r.dpi.includes(filters.dpi))                        return false;
      if (filters.estadoDesc    && r.estadoDesc !== filters.estadoDesc)                 return false;
      return true;
    });
  },

  /**
   * Detecta duplicados por DPI + número de asamblea antes de cargar.
   * @param {object[]} rows
   * @returns {object[]} filas duplicadas
   */
  findDuplicates: (rows) =>
    rows.filter((row) =>
      _registros.some(
        (r) => r.dpi === row.dpi && r.numeroAsamblea === row.numeroAsamblea,
      ),
    ),

  /**
   * Carga masiva con reemplazo opcional por asamblea.
   * @param {object[]} rows
   * @param {{ reemplazar: boolean, numeroAsamblea: string }} options
   */
  cargaMasiva: (rows, { reemplazar, numeroAsamblea }) => {
    if (reemplazar) {
      _registros = _registros.filter((r) => r.numeroAsamblea !== numeroAsamblea);
    }

    let exitosos = 0;
    const errores = [];

    rows.forEach((row, i) => {
      if (!row.dpi || !row.numeroAsamblea) {
        errores.push(`Fila ${i + 2}: DPI o número de asamblea vacío.`);
        return;
      }
      _registros.push({ id: _nextId++, ...row });
      exitosos++;
    });

    _bitacora.unshift(
      crearEntradaBitacora({
        usuario: USUARIO_DEMO,
        operacion: 'CARGA MASIVA',
        campo: `Asamblea ${numeroAsamblea}`,
        valorAnterior: reemplazar ? 'Reemplazado' : 'Acumulado',
        valorNuevo: `${exitosos} registros`,
        registroId: 0,
      }),
    );

    return { exitosos, rechazados: errores.length, errores };
  },
};

export default HistoricaService;
