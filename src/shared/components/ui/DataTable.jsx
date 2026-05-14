/**
 * @file shared/components/ui/DataTable.jsx
 * @description Tabla de datos genérica con soporte para estado vacío.
 * Recibe columnas y rows declarativamente.
 */
import { TableProperties } from 'lucide-react';

/**
 * @typedef {{ key: string, header: string, width?: string, render?: Function }} Column
 */

/**
 * @param {{
 *   columns: Column[],
 *   rows: object[],
 *   emptyMessage?: string,
 *   className?: string
 * }} props
 */
export const DataTable = ({
  columns,
  rows,
  emptyMessage = 'No hay registros para mostrar',
  className = '',
}) => (
  <div className={`table-wrap ${className}`}>
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={col.width ? { width: col.width } : {}}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>
              <div className="empty-state">
                <div className="empty-state__icon">
                  <TableProperties size={22} />
                </div>
                <p className="empty-state__title">{emptyMessage}</p>
              </div>
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
