/**
 * @file modules/estados-precalificacion/components/EstadoFormModal.jsx
 * @description Modal de creación / edición de un estado de precalificación.
 * Aplica validaciones en tiempo real: obligatoriedad y unicidad (HU-61309).
 */
import { useState, useEffect } from 'react';
import { Modal }     from '../../../shared/components/ui/Modal';
import { Button }    from '../../../shared/components/ui/Button';
import { FormField, Input } from '../../../shared/components/ui/FormField';
import { Save }      from 'lucide-react';
import { VALIDACION } from '../../../core/constants';

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: Function,
 *   onSave: Function,
 *   validate: Function,
 *   estadoToEdit?: object|null
 * }} props
 */
export const EstadoFormModal = ({ isOpen, onClose, onSave, validate, estadoToEdit }) => {
  const isEditing = Boolean(estadoToEdit);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError]             = useState('');

  // Precarga el valor al abrir en modo edición
  useEffect(() => {
    if (isOpen) {
      setDescripcion(estadoToEdit?.descripcion ?? '');
      setError('');
    }
  }, [isOpen, estadoToEdit]);

  const handleChange = (e) => {
    const val = e.target.value;
    setDescripcion(val);
    // Validación reactiva en cada keystroke
    const result = validate(val, estadoToEdit?.id ?? null);
    setError(result.valid ? '' : result.error);
  };

  const handleSave = () => {
    const result = validate(descripcion, estadoToEdit?.id ?? null);
    if (!result.valid) { setError(result.error); return; }
    onSave(descripcion);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Estado de Precalificación' : 'Nuevo Estado de Precalificación'}
      subtitle="HU-61309 · ACCFRMXXX"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            icon={<Save size={13} />}
            onClick={handleSave}
            disabled={Boolean(error) || !descripcion.trim()}
          >
            Guardar
          </Button>
        </>
      }
    >
      <div className="form-grid">
        {/* Código — solo lectura, autogenerado */}
        <FormField label="Código" hint="PK incremental, autogenerado · No editable">
          <Input
            value={isEditing ? String(estadoToEdit.id).padStart(3, '0') : 'Autogenerado'}
            disabled
            readOnly
          />
        </FormField>

        {/* Descripción — editable con validación */}
        <FormField label="Descripción" required error={error}>
          <Input
            value={descripcion}
            onChange={handleChange}
            maxLength={VALIDACION.DESC_MAX_LENGTH}
            placeholder="Ej: Aprobado"
            error={Boolean(error)}
            autoFocus
          />
          <span className="char-counter">
            {descripcion.length}/{VALIDACION.DESC_MAX_LENGTH}
          </span>
        </FormField>
      </div>
    </Modal>
  );
};
