/**
 * @file modules/casos-especiales/components/CasoFormModal.jsx
 * @description Modal de creación / edición de caso especial.
 * Aplica validación condicional de fechaDefuncion (requerida si estado=Fallecido).
 * @see HU-61310
 */
import { useState, useEffect } from 'react';
import { Modal }      from '../../../shared/components/ui/Modal';
import { Button }     from '../../../shared/components/ui/Button';
import { FormField, Input, Select } from '../../../shared/components/ui/FormField';
import { Save }       from 'lucide-react';
import { TIPO_DOCUMENTO, ESTADO_ID } from '../../../core/constants';

const ESTADOS_CASO = [
  { id: 3, label: 'Denegado' },
  { id: 4, label: 'Acciones Adquiridas Anómalamente' },
  { id: 5, label: 'Revocado' },
  { id: 6, label: 'Fallecido' },
  { id: 7, label: 'Limitación Participación Asamblea' },
];

const INITIAL = {
  tipoDocumento: '', numeroDocumento: '', nombreCompleto: '',
  estadoId: '', estadoDesc: '', fechaDefuncion: '',
};

/**
 * @param {{
 *   isOpen: boolean, onClose: Function, onSave: Function,
 *   validate: Function, casoToEdit?: object|null
 * }} props
 */
export const CasoFormModal = ({ isOpen, onClose, onSave, validate, casoToEdit }) => {
  const isEditing = Boolean(casoToEdit);
  const [form, setForm]   = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(casoToEdit ?? INITIAL);
      setErrors({});
    }
  }, [isOpen, casoToEdit]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setEstado = (e) => {
    const selected = ESTADOS_CASO.find((s) => String(s.id) === e.target.value);
    setForm((prev) => ({
      ...prev,
      estadoId: selected?.id ?? '',
      estadoDesc: selected?.label ?? '',
      fechaDefuncion: selected?.id !== ESTADO_ID.FALLECIDO ? '' : prev.fechaDefuncion,
    }));
  };

  const isFallecido = form.estadoId === ESTADO_ID.FALLECIDO || Number(form.estadoId) === ESTADO_ID.FALLECIDO;

  const handleSave = () => {
    const errs = {};
    const dupeCheck = validate(form.tipoDocumento, form.numeroDocumento, casoToEdit?.id ?? null);
    if (!dupeCheck.valid)       errs.numeroDocumento = dupeCheck.error;
    if (!form.nombreCompleto?.trim()) errs.nombreCompleto = 'El nombre completo es obligatorio.';
    if (!form.estadoId)               errs.estadoId = 'Seleccione un estado.';
    if (isFallecido && !form.fechaDefuncion) errs.fechaDefuncion = 'Requerido cuando el estado es "Fallecido".';

    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave(form);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Caso Especial' : 'Nuevo Caso Especial de Precalificación'}
      subtitle="HU-61310 · Administración individual"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" icon={<Save size={13} />} onClick={handleSave}>Guardar</Button>
        </>
      }
    >
      <div className="form-grid form-grid--2">
        <FormField label="Tipo de Documento" required error={errors.tipoDocumento}>
          <Select value={form.tipoDocumento} onChange={set('tipoDocumento')} error={Boolean(errors.tipoDocumento)}>
            <option value="">Seleccionar…</option>
            {Object.values(TIPO_DOCUMENTO).map((t) => <option key={t}>{t}</option>)}
          </Select>
        </FormField>

        <FormField label="Número de Documento" required error={errors.numeroDocumento}>
          <Input value={form.numeroDocumento} onChange={set('numeroDocumento')} placeholder="Ej: 2265780540101" error={Boolean(errors.numeroDocumento)} />
        </FormField>

        <div style={{ gridColumn: '1 / -1' }}>
          <FormField label="Nombre Completo" required error={errors.nombreCompleto}>
            <Input value={form.nombreCompleto} onChange={set('nombreCompleto')} placeholder="APELLIDO NOMBRE" error={Boolean(errors.nombreCompleto)} />
          </FormField>
        </div>

        <FormField label="Estado de Precalificación" required error={errors.estadoId}>
          <Select value={String(form.estadoId)} onChange={setEstado} error={Boolean(errors.estadoId)}>
            <option value="">Seleccionar…</option>
            {ESTADOS_CASO.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </Select>
        </FormField>

        {/* Fecha defunción — condicional */}
        {isFallecido && (
          <FormField label="Fecha de Defunción" required error={errors.fechaDefuncion}>
            <Input type="date" value={form.fechaDefuncion} onChange={set('fechaDefuncion')} error={Boolean(errors.fechaDefuncion)} />
          </FormField>
        )}
      </div>
    </Modal>
  );
};
