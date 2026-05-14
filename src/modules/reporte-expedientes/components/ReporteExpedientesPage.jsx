/**
 * @file modules/reporte-expedientes/components/ReporteExpedientesPage.jsx
 * @description Página del reporte ACCFRM0828 con motor de clasificación automática.
 * Columnas nuevas: Hora (HH:mm:ss) + Estado Precalificación (descripción).
 * @see HU-61568
 */
import { FileText, Shield, Download } from 'lucide-react';
import { PageHeader }  from '../../../shared/components/ui/PageHeader';
import { Button }      from '../../../shared/components/ui/Button';
import { Badge }       from '../../../shared/components/ui/Badge';
import { StatCard }    from '../../../shared/components/ui/StatCard';
import { FormField, Select } from '../../../shared/components/ui/FormField';
import { useReporte }  from '../hooks/useReporte';
import { useToast }    from '../../../core/hooks/useToast';
import { ToastContainer } from '../../../shared/components/feedback/ToastContainer';
import { TIPO_ASAMBLEA } from '../../../core/constants';

/** Etiqueta legible para la fuente del motor */
const FUENTE_LABEL = {
  caso: 'Caso Especial',
  hist: 'Cal. Histórica',
  new:  'Nuevo',
};

export const ReporteExpedientesPage = () => {
  const { rows, filters, summary, applyFilters, resetFilters } = useReporte();
  const { toasts, toast, removeToast } = useToast();

  const setFilter = (key) => (e) =>
    applyFilters({ ...filters, [key]: e.target.value });

  return (
    <>
      <div className="page anim-fade-up">
        <PageHeader
          title="Reporte de Expedientes"
          subtitle="ACCFRM0828 · Motor de clasificación automática activo · Nuevas columnas: Hora + Estado Precalificación"
          moduleTag="ACCFRM0828 · HU-61568"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" icon={<Download size={14} />} onClick={() => toast.success('Exportando a Excel…')}>Excel</Button>
              <Button variant="primary"  icon={<FileText size={14} />} onClick={() => toast.success('Generando PDF horizontal…')}>PDF</Button>
            </div>
          }
        />

        {/* Panel motor de clasificación */}
        <div className="engine-panel">
          <div className="engine-panel__icon"><Shield size={30} /></div>
          <div className="engine-panel__info">
            <p className="engine-panel__title">Motor de Clasificación Activo — HU-61568 Criterio #5</p>
            <p className="engine-panel__rule">Caso Especial (prioridad absoluta) → Calificación Histórica → Nuevo</p>
          </div>
          <div className="engine-panel__stats">
            <div className="engine-stat"><span className="engine-stat__val engine-stat__val--caso">{summary.desdeCasoEspecial}</span><span className="engine-stat__label">Caso Especial</span></div>
            <div className="engine-stat"><span className="engine-stat__val engine-stat__val--hist">{summary.desdeHistorica}</span><span className="engine-stat__label">Cal. Histórica</span></div>
            <div className="engine-stat"><span className="engine-stat__val engine-stat__val--new">{summary.nuevo}</span><span className="engine-stat__label">Nuevo</span></div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="form-grid form-grid--4">
            <FormField label="Asamblea *">
              <Select value={filters.tipoAsamblea} onChange={setFilter('tipoAsamblea')}>
                {Object.values(TIPO_ASAMBLEA).map((t) => <option key={t}>{t}</option>)}
              </Select>
            </FormField>
            <FormField label="Sede">
              <Select value={filters.sede} onChange={setFilter('sede')}>
                <option value="">Todas las sedes</option>
                {['Central','Zona 4','Mixco'].map((s) => <option key={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Estado Precalificación">
              <Select value={filters.estadoDesc} onChange={setFilter('estadoDesc')}>
                <option value="">Todos</option>
                {['Aprobado','Nuevo','Denegado','Fallecido','Revocado','Limitación Participación Asamblea'].map((e) => <option key={e}>{e}</option>)}
              </Select>
            </FormField>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button variant="outline" onClick={resetFilters} style={{ width: '100%' }}>Limpiar filtros</Button>
            </div>
          </div>
        </div>

        {/* Tabla del reporte */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Barra de preview */}
          <div className="report-bar">
            <FileText size={13} />
            Reporte ACCFRM0828 · {rows.length} registros · Formato horizontal · Sin truncamiento
            <span className="report-bar__badge">⚡ Nuevos campos resaltados</span>
          </div>

          <div className="table-wrap">
            <table className="data-table report-table">
              <thead>
                <tr>
                  <th>Cred.</th>
                  <th style={{ minWidth: 200 }}>Accionista — Issue Auditoría</th>
                  <th>Nombre</th>
                  <th>Sede</th>
                  <th>DPI</th>
                  <th>Fecha</th>
                  <th className="col-new">⚡ Hora</th>
                  <th>Propios</th>
                  <th>Ajenos</th>
                  <th>Total V.A</th>
                  <th>Total V.</th>
                  <th>Usuario</th>
                  <th className="col-new" style={{ minWidth: 180 }}>⚡ Est. Precalificación</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.credencial}>
                    <td><span className="code-badge">{row.credencial}</span></td>
                    <td style={{ maxWidth: 220, wordBreak: 'break-word', fontSize: 11 }}>{row.accionista}</td>
                    <td className="fw-500 text-sm">{row.nombre}</td>
                    <td className="text-sm">{row.sede}</td>
                    <td className="mono text-sm">{row.dpi}</td>
                    <td className="text-sm">{row.fecha}</td>
                    <td className="col-new mono text-sm fw-600">{row.hora}</td>
                    <td style={{ textAlign: 'right' }}>{row.propios}</td>
                    <td style={{ textAlign: 'right' }}>{row.ajenos}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.totalVotosA}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.totalVotos}</td>
                    <td className="text-muted text-sm">{row.usuario}</td>
                    <td className="col-new">
                      <Badge label={row.estadoDesc} size="sm" />
                      <br />
                      <span className="fuente-label">{FUENTE_LABEL[row.fuente]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span className="text-muted text-sm">Mostrando {rows.length} registro(s)</span>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
