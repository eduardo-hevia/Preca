/**
 * @file modules/casos-especiales/components/CasosEspecialesPage.jsx
 * @description Página principal del módulo HU-61310.
 * Grid con filtros, CRUD individual, carga masiva y bitácora.
 */
import { Users, Plus, Upload, Pencil, Ban } from 'lucide-react';
import { PageHeader }       from '../../../shared/components/ui/PageHeader';
import { Button }           from '../../../shared/components/ui/Button';
import { Badge }            from '../../../shared/components/ui/Badge';
import { DataTable }        from '../../../shared/components/ui/DataTable';
import { StatCard }         from '../../../shared/components/ui/StatCard';
import { Select }           from '../../../shared/components/ui/FormField';
import { CasoFormModal }    from './CasoFormModal';
import { CargaMasivaModal } from './CargaMasivaModal';
import { BitacoraPanel }    from '../../estados-precalificacion/components/BitacoraPanel';
import { ConfirmDialog }    from '../../../shared/components/feedback/ConfirmDialog';
import { useCasos }         from '../hooks/useCasos';
import { useModal }         from '../../../core/hooks/useModal';
import { useToast }         from '../../../core/hooks/useToast';
import { ToastContainer }   from '../../../shared/components/feedback/ToastContainer';
import { padId }            from '../../../core/utils';

export const CasosEspecialesPage = () => {
  const {
    bitacora, searchQuery, setSearchQuery, filterEstado, setFilterEstado,
    filterTipo, setFilterTipo, filteredCasos, validate, create, update, softDelete, cargaMasiva,
  } = useCasos();

  const modalForm    = useModal();
  const modalCarga   = useModal();
  const modalConfirm = useModal();
  const { toasts, toast, removeToast } = useToast();

  const handleSave = (payload) => {
    if (modalForm.data) {
      update(modalForm.data.id, payload);
      toast.success('Caso especial actualizado. Bitácora registrada.');
    } else {
      create(payload);
      toast.success('Caso especial creado. Bitácora registrada.');
    }
  };

  const handleCarga = (rows) => {
    const result = cargaMasiva(rows);
    toast.success(`Carga completada: ${result.exitosos} exitosos, ${result.rechazados} rechazados.`);
    return result;
  };

  const handleDeleteRequest = (caso) => {
    modalConfirm.open(caso);
  };

  const handleDeleteConfirm = () => {
    softDelete(modalConfirm.data.id);
    toast.warn('Registro eliminado lógicamente. Bitácora actualizada.');
  };

  const columns = [
    { key: 'id',              header: 'ID',              width: '70px',  render: (v) => <span className="code-badge">{padId(v)}</span> },
    { key: 'tipoDocumento',   header: 'Tipo Doc.',       width: '90px',  render: (v) => <Badge label={v} size="sm" /> },
    { key: 'numeroDocumento', header: 'No. Documento',                   render: (v) => <span className="mono text-sm">{v}</span> },
    { key: 'nombreCompleto',  header: 'Nombre Completo',                 render: (v) => <span className="fw-500">{v}</span> },
    { key: 'estadoDesc',      header: 'Estado Precal.',                  render: (v) => <Badge label={v} size="sm" /> },
    { key: 'fechaDefuncion',  header: 'Fecha Defunción',                 render: (v) => <span className="text-muted text-sm">{v ?? '—'}</span> },
    { key: 'registradoEn',    header: 'Registrado',                      render: (v) => <span className="text-muted text-sm">{v}</span> },
    {
      key: 'id', header: 'Acciones', width: '80px',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="icon-btn" title="Editar" onClick={() => modalForm.open(row)}>
            <Pencil size={13} />
          </button>
          <button className="icon-btn icon-btn--danger" title="Eliminar lógico" onClick={() => handleDeleteRequest(row)}>
            <Ban size={13} />
          </button>
        </div>
      ),
    },
  ];

  const denegados  = filteredCasos.filter((c) => c.estadoDesc === 'Denegado').length;
  const fallecidos = filteredCasos.filter((c) => c.estadoDesc === 'Fallecido').length;

  return (
    <>
      <div className="page anim-fade-up">
        <PageHeader
          title="Mantenimiento de Casos Especiales de Precalificación"
          subtitle="Gestión individual y carga masiva · Soft-delete · HU-61310"
          moduleTag="ACCFRMXXX · HU-61310"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" icon={<Upload size={14} />} onClick={modalCarga.open}>
                Carga Masiva
              </Button>
              <Button variant="primary" icon={<Plus size={14} />} onClick={() => modalForm.open(null)}>
                Nuevo Registro
              </Button>
            </div>
          }
        />

        <div className="stats-grid">
          <StatCard icon={<Users size={18} />}  value={filteredCasos.length} label="Casos activos"   variant="mint"  />
          <StatCard icon={<Ban size={18} />}    value={denegados}            label="Denegados"        variant="red"   />
          <StatCard icon={<Users size={18} />}  value={fallecidos}           label="Fallecidos"       variant="amber" />
          <StatCard icon={<Upload size={18} />} value="20/04/2026"           label="Última carga"     variant="blue"  />
        </div>

        <div className="card">
          <div className="card__header">
            <div className="section-title"><Users size={15} />Registros</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div className="search-box" style={{ maxWidth: 200 }}>
                <input className="search-box__input" placeholder="Buscar…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={{ fontSize: 12 }}>
                <option value="">Todos los estados</option>
                {['Denegado','Revocado','Fallecido','Limitación Participación Asamblea','Acciones Adquiridas Anómalamente'].map((e) => <option key={e}>{e}</option>)}
              </Select>
              <Select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} style={{ fontSize: 12 }}>
                <option value="">DPI y Cédula</option>
                <option>DPI</option>
                <option>Cédula</option>
              </Select>
              <Button variant="outline" size="sm">↓ Excel</Button>
            </div>
          </div>

          <DataTable columns={columns} rows={filteredCasos} emptyMessage="No hay casos especiales registrados." />

          <div className="table-footer">
            <span className="text-muted text-sm">Mostrando {filteredCasos.length} registro(s)</span>
          </div>
        </div>

        <BitacoraPanel entries={bitacora} />
      </div>

      <CasoFormModal
        isOpen={modalForm.isOpen}
        onClose={modalForm.close}
        onSave={handleSave}
        validate={validate}
        casoToEdit={modalForm.data}
      />

      <CargaMasivaModal
        isOpen={modalCarga.isOpen}
        onClose={modalCarga.close}
        onCarga={handleCarga}
      />

      <ConfirmDialog
        isOpen={modalConfirm.isOpen}
        onClose={modalConfirm.close}
        onConfirm={handleDeleteConfirm}
        title="Eliminar registro lógicamente"
        description={`El caso #${padId(modalConfirm.data?.id ?? 0)} será marcado como inactivo. La operación quedará registrada en bitácora.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
