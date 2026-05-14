/**
 * @file modules/estados-precalificacion/components/EstadosPrecalificacionPage.jsx
 * @description Página principal del módulo HU-61309.
 * Grid con 7 estados base, modal crear/editar, bitácora de auditoría.
 */
import { CheckSquare, Plus, Search, Pencil, ShieldCheck, ClipboardList } from 'lucide-react';
import { PageHeader }      from '../../../shared/components/ui/PageHeader';
import { Button }          from '../../../shared/components/ui/Button';
import { Badge }           from '../../../shared/components/ui/Badge';
import { DataTable }       from '../../../shared/components/ui/DataTable';
import { StatCard }        from '../../../shared/components/ui/StatCard';
import { EstadoFormModal } from './EstadoFormModal';
import { BitacoraPanel }   from './BitacoraPanel';
import { useEstados }      from '../hooks/useEstados';
import { useModal }        from '../../../core/hooks/useModal';
import { useToast }        from '../../../core/hooks/useToast';
import { ToastContainer }  from '../../../shared/components/feedback/ToastContainer';
import { padId }           from '../../../core/utils';

export const EstadosPrecalificacionPage = () => {
  const {
    bitacora, searchQuery, setSearchQuery, filteredEstados, validate, create, update,
  } = useEstados();

  const modal             = useModal();
  const { toasts, toast, removeToast } = useToast();

  /** Abre modal para nuevo estado */
  const handleNew = () => modal.open(null);

  /** Abre modal para editar estado existente */
  const handleEdit = (estado) => modal.open(estado);

  /** Guarda (crea o actualiza) y muestra toast */
  const handleSave = (descripcion) => {
    if (modal.data) {
      update(modal.data.id, descripcion);
      toast.success('Estado actualizado correctamente. Bitácora registrada.');
    } else {
      create(descripcion);
      toast.success('Nuevo estado creado correctamente. Bitácora registrada.');
    }
  };

  /** Definición declarativa de columnas para DataTable */
  const columns = [
    {
      key: 'id',
      header: 'Código',
      width: '90px',
      render: (val) => <span className="code-badge">{padId(val)}</span>,
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (val) => <span className="fw-500">{val}</span>,
    },
    {
      key: 'tipo',
      header: 'Tipo',
      width: '100px',
      render: (val) => <Badge label={val === 'base' ? 'Base' : 'Custom'} variant={val} size="sm" />,
    },
    {
      key: 'modificadoEn',
      header: 'Últ. modificación',
      render: (val) => <span className="text-muted text-sm">{val}</span>,
    },
    {
      key: 'usuario',
      header: 'Usuario',
      render: (val) => <span className="text-muted text-sm">{val}</span>,
    },
    {
      key: 'id',
      header: 'Acciones',
      width: '80px',
      render: (_, row) => (
        <button
          className="icon-btn"
          title="Editar estado"
          onClick={() => handleEdit(row)}
          aria-label={`Editar ${row.descripcion}`}
        >
          <Pencil size={13} />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page anim-fade-up">
        {/* ── HEADER ── */}
        <PageHeader
          title="Mantenimiento de Estados de Precalificación"
          subtitle="Catálogo maestro controlado · Sin eliminación física · 7 estados base"
          moduleTag="ACCFRMXXX · HU-61309"
          actions={
            <Button variant="primary" icon={<Plus size={14} />} onClick={handleNew}>
              Nuevo Estado
            </Button>
          }
        />

        {/* ── STATS ── */}
        <div className="stats-grid">
          <StatCard icon={<CheckSquare size={18} />} value={filteredEstados.length} label="Estados activos"      variant="mint"   />
          <StatCard icon={<ShieldCheck  size={18} />} value={7}                      label="Registros base"       variant="blue"   />
          <StatCard icon={<ClipboardList size={18}/>} value={bitacora.length}        label="Movimientos bitácora" variant="amber"  />
          <StatCard icon={<ShieldCheck  size={18} />} value={0}                      label="Eliminaciones"        variant="mint"   />
        </div>

        {/* ── GRID DE ESTADOS ── */}
        <div className="card">
          <div className="card__header">
            <div className="section-title">
              <CheckSquare size={15} />
              Catálogo de Estados
            </div>
            {/* Búsqueda */}
            <div className="search-box">
              <Search size={14} className="search-box__icon" />
              <input
                className="search-box__input"
                placeholder="Buscar por código o descripción…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar estados"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={filteredEstados}
            emptyMessage="No se encontraron estados con ese criterio."
          />

          <div className="table-footer">
            <span className="text-muted text-sm">
              Mostrando {filteredEstados.length} registro(s)
            </span>
          </div>
        </div>

        {/* ── BITÁCORA ── */}
        <BitacoraPanel entries={bitacora} />
      </div>

      {/* ── MODAL ── */}
      <EstadoFormModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSave={handleSave}
        validate={validate}
        estadoToEdit={modal.data}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
