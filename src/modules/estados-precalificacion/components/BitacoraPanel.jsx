/**
 * @file modules/estados-precalificacion/components/BitacoraPanel.jsx
 * @description Panel de bitácora de auditoría con diff visual.
 * Reutilizable por cualquier módulo que requiera trazabilidad (HU-61309 #3).
 */
import { FileText, Download } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

/**
 * @param {{ entries: object[] }} props
 */
export const BitacoraPanel = ({ entries = [] }) => (
  <div className="card">
    <div className="card__header">
      <div className="section-title">
        <FileText size={15} />
        Bitácora de Auditoría
      </div>
      <Button variant="outline" size="sm" icon={<Download size={12} />}>
        Exportar
      </Button>
    </div>

    <div className="bitacora-list">
      {entries.length === 0 ? (
        <p className="bitacora-empty">Sin movimientos registrados.</p>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="bitacora-entry">
            <div className="bitacora-entry__dot" />
            <div className="bitacora-entry__body">
              <p className="bitacora-entry__meta">
                {entry.timestamp} · <strong>{entry.usuario}</strong> · {entry.operacion}
              </p>
              <p className="bitacora-entry__desc">
                Registro #{entry.registroId} — Campo: <strong>{entry.campo}</strong>
              </p>
              <div className="bitacora-entry__diff">
                <span className="diff diff--old">← {entry.valorAnterior}</span>
                <span className="diff diff--new">→ {entry.valorNuevo}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
