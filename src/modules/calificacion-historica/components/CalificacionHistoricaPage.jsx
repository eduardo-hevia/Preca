/**
 * @file modules/calificacion-historica/components/CalificacionHistoricaPage.jsx
 * @description Página del módulo HU-61314.
 * Solo consulta + carga masiva. Sin CRUD individual.
 */
import { useState } from 'react';
import { History, Upload, Search, RotateCcw } from 'lucide-react';
import { PageHeader }    from '../../../shared/components/ui/PageHeader';
import { Button }        from '../../../shared/components/ui/Button';
import { Badge }         from '../../../shared/components/ui/Badge';
import { DataTable }     from '../../../shared/components/ui/DataTable';
import { StatCard }      from '../../../shared/components/ui/StatCard';
import { FormField, Input, Select } from '../../../shared/components/ui/FormField';
import { Modal }         from '../../../shared/components/ui/Modal';
import { BitacoraPanel } from '../../estados-precalificacion/components/BitacoraPanel';
import { useHistorica }  from '../hooks/useHistorica';
import { useModal }      from '../../../core/hooks/useModal';
import { useToast }      from '../../../core/hooks/useToast';
import { ToastContainer } from '../../../shared/components/feedback/ToastContainer';
import { TIPO_ASAMBLEA }  from '../../../core/constants';

// Filas mock para la carga simulada
const MOCK_ROWS = [
  { numeroAsamblea: '2025-01', tipoAsamblea: 'Ordinaria', noExpediente: 'EXP-003001', noGestion: 'G-0101', dpi: '9999888877701', nombre: 'DEMO CARGA 2025', estadoDesc: 'Aprobado', fechaSolicitud: '15/03/2025' },
  { numeroAsamblea: '2025-01', tipoAsamblea: 'Ordinaria', noExpediente: 'EXP-003002', noGestion: '—',      dpi: '1111222233302', nombre: 'DEMO CARGA 2025 B', estadoDesc: 'Denegado', fechaSolicitud: '15/03/2025' },
];

export const CalificacionHistoricaPage = () => {
  const {
    filtered, bitacora, filters, applyFilters, resetFilters, cargaMasiva,
  } = useHistorica();

  const [localFilters, setLocalFilters] = useState(filters);
  const modalCarga = useModal();
  const [cargaForm, setCargaForm] = useState({ numeroAsamblea: '', tipoAsamblea: 'Ordinaria' });
  const [cargaStep, setCargaStep] = useState('idle');
  const [cargaResult, setCargaResult] = useState(null);
  const { toasts, toast, removeToast } = useToast();

  const setFilter = (key) => (e) => setLocalFilters((p) => ({ ...p, [key]: e.target.value }));

  const handleSearch = () => applyFilters(localFilters);
  const handleReset  = () => { setLocalFilters({ numeroAsamblea:'', tipoAsamblea:'', dpi:'', estadoDesc:'' }); resetFilters(); };

  const handleCargaStart = () => {
    setCargaStep('loading');
    setTimeout(() => {
      const result = cargaMasiva(MOCK_ROWS, { reemplazar: false, numeroAsamblea: cargaForm.numeroAsamblea || '2025-01' });
      setCargaResult(result);
      setCargaStep('done');
      toast.success(`Carga completada: ${result.exitosos} exitosos.`);
    }, 2000);
  };

  const handleCargaClose = () => {
    setCargaStep('idle');
    setCargaResult(null);
    modalCarga.close();
  };

  const columns = [
    { key: 'numeroAsamblea', header: 'No. Asamblea',   render: (v) => <span className="code-badge">{v}</span> },
    { key: 'tipoAsamblea',   header: 'Tipo',            render: (v) => <Badge label={v} size="sm" /> },
    { key: 'noExpediente',   header: 'No. Expediente',  render: (v) => <span className="mono text-sm">{v}</span> },
    { key: 'noGestion',      header: 'No. Gestión',     render: (v) => <span className="text-muted text-sm">{v}</span> },
    { key: 'dpi',            header: 'DPI',             render: (v) => <span className="mono text-sm">{v}</span> },
    { key: 'nombre',         header: 'Nombre',          render: (v) => <span className="fw-500 text-sm">{v}</span> },
    { key: 'estadoDesc',     header: 'Estado',          render: (v) => <Badge label={v} size="sm" /> },
    { key: 'fechaSolicitud', header: 'Fecha Solicitud', render: (v) => <span className="text-muted text-sm">{v}</span> },
  ];

  return (
    <>
      <div className="page anim-fade-up">
        <PageHeader
          title="Mantenimiento de Calificación Histórica"
          subtitle="Consulta y carga masiva de registros históricos por asamblea · HU-61314"
          moduleTag="ACCFRMXXX · HU-61314"
          actions={
            <Button variant="outline" icon={<Upload size={14} />} onClick={modalCarga.open}>
              Carga Masiva Excel
            </Button>
          }
        />

        <div className="stats-grid">
          <StatCard icon={<History size={18} />} value={filtered.length}   label="Registros encontrados" variant="mint"  />
          <StatCard icon={<History size={18} />} value="2024-02"           label="Última asamblea"        variant="blue"  />
          <StatCard icon={<History size={18} />} value={bitacora.length}   label="Cargas realizadas"      variant="amber" />
          <StatCard icon={<History size={18} />} value={3}                 label="Tipos de asamblea"      variant="mint"  />
        </div>

        {/* Panel de filtros */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>
            <Search size={15} /> Filtros de Consulta
          </div>
          <div className="form-grid form-grid--5">
            <FormField label="No. Asamblea">
              <Input placeholder="Ej: 2024-01" value={localFilters.numeroAsamblea} onChange={setFilter('numeroAsamblea')} />
            </FormField>
            <FormField label="Tipo Asamblea">
              <Select value={localFilters.tipoAsamblea} onChange={setFilter('tipoAsamblea')}>
                <option value="">Todos</option>
                {Object.values(TIPO_ASAMBLEA).map((t) => <option key={t}>{t}</option>)}
              </Select>
            </FormField>
            <FormField label="DPI">
              <Input placeholder="No. DPI" value={localFilters.dpi} onChange={setFilter('dpi')} />
            </FormField>
            <FormField label="Estado">
              <Select value={localFilters.estadoDesc} onChange={setFilter('estadoDesc')}>
                <option value="">Todos</option>
                {['Aprobado','Denegado','Nuevo','Revocado'].map((e) => <option key={e}>{e}</option>)}
              </Select>
            </FormField>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <Button variant="primary" onClick={handleSearch} style={{ flex: 1 }}>Buscar</Button>
              <Button variant="outline" onClick={handleReset} icon={<RotateCcw size={13} />} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="section-title"><History size={15} />Registros Históricos</div>
            <Button variant="outline" size="sm">↓ Exportar Excel</Button>
          </div>
          <DataTable columns={columns} rows={filtered} emptyMessage="No hay registros con los filtros aplicados." />
          <div className="table-footer">
            <span className="text-muted text-sm">Mostrando {filtered.length} registro(s)</span>
          </div>
        </div>

        <BitacoraPanel entries={bitacora} />
      </div>

      {/* Modal carga masiva */}
      <Modal
        isOpen={modalCarga.isOpen}
        onClose={handleCargaClose}
        title="Carga Masiva — Calificación Histórica"
        subtitle="HU-61314 · Validación de duplicidad DPI + Asamblea"
        size="md"
        footer={
          cargaStep === 'done'
            ? <Button variant="primary" onClick={handleCargaClose}>Cerrar</Button>
            : <>
                <Button variant="outline" onClick={handleCargaClose} disabled={cargaStep === 'loading'}>Cancelar</Button>
                <Button variant="primary" icon={<Upload size={13} />} onClick={handleCargaStart} loading={cargaStep === 'loading'}>
                  {cargaStep === 'loading' ? 'Procesando…' : 'Procesar Carga'}
                </Button>
              </>
        }
      >
        {cargaStep === 'idle' && (
          <>
            <div className="alert alert--danger" style={{ marginBottom: 14 }}>
              <span>En caso de duplicidad (DPI + No. Asamblea), se solicitará confirmación para reemplazar o cancelar.</span>
            </div>
            <div className="form-grid form-grid--2" style={{ marginBottom: 14 }}>
              <FormField label="No. Asamblea" required>
                <Input placeholder="Ej: 2025-01" value={cargaForm.numeroAsamblea} onChange={(e) => setCargaForm((p) => ({ ...p, numeroAsamblea: e.target.value }))} />
              </FormField>
              <FormField label="Tipo Asamblea" required>
                <Select value={cargaForm.tipoAsamblea} onChange={(e) => setCargaForm((p) => ({ ...p, tipoAsamblea: e.target.value }))}>
                  {Object.values(TIPO_ASAMBLEA).map((t) => <option key={t}>{t}</option>)}
                </Select>
              </FormField>
            </div>
            <div className="upload-zone">
              <Upload size={32} className="upload-zone__icon" />
              <p className="upload-zone__text">Seleccionar archivo Excel</p>
              <p className="upload-zone__hint">Columnas: No.Asamblea · Tipo · No.Expediente · No.Gestión · DPI · Nombre · Estado · Fecha</p>
            </div>
          </>
        )}
        {cargaStep === 'loading' && (
          <div className="carga-progress">
            <div className="progress-bar"><div className="progress-bar__fill" style={{ width: '60%', transition: 'width 2s' }} /></div>
            <p className="text-muted text-sm" style={{ marginTop: 8, textAlign: 'center' }}>Procesando archivo…</p>
          </div>
        )}
        {cargaStep === 'done' && cargaResult && (
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div className="stat-result stat-result--ok"><span className="stat-result__val">{cargaResult.exitosos}</span><span className="stat-result__label">Exitosos</span></div>
            <div className="stat-result stat-result--err"><span className="stat-result__val">{cargaResult.rechazados}</span><span className="stat-result__label">Rechazados</span></div>
            <div className="stat-result stat-result--total"><span className="stat-result__val">{cargaResult.exitosos + cargaResult.rechazados}</span><span className="stat-result__label">Total</span></div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
