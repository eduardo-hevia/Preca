/**
 * @file shared/components/feedback/ConfirmDialog.jsx
 * @description Diálogo de confirmación genérico para operaciones destructivas.
 * Requerido por HU-61310 (eliminación lógica) y HU-61314 (reemplazo en carga masiva).
 */
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: Function,
 *   onConfirm: Function,
 *   title: string,
 *   description: string,
 *   confirmLabel?: string,
 *   variant?: 'warn'|'danger'
 * }} props
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  variant = 'warn',
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=""
    size="sm"
    footer={
      <>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="confirm-dialog">
      <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
        <AlertTriangle size={24} />
      </div>
      <h3 className="confirm-dialog__title">{title}</h3>
      <p className="confirm-dialog__desc">{description}</p>
    </div>
  </Modal>
);
