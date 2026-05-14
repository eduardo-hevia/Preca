/**
 * @file shared/components/feedback/ToastContainer.jsx
 * @description Contenedor de notificaciones toast con auto-dismiss.
 * Se renderiza en App level y recibe toasts desde useToast().
 */
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

/** @type {Record<string, React.ReactNode>} */
const ICON_MAP = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  warn:    <AlertTriangle size={16} />,
};

/**
 * @param {{
 *   toasts: Array<{id: number, message: string, type: string}>,
 *   onRemove: (id: number) => void
 * }} props
 */
export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="toast-container" role="region" aria-live="polite">
    {toasts.map((t) => (
      <div key={t.id} className={`toast toast--${t.type} anim-slide-right`}>
        <span className={`toast__icon toast__icon--${t.type}`}>
          {ICON_MAP[t.type]}
        </span>
        <span className="toast__message">{t.message}</span>
        <button
          className="toast__close"
          onClick={() => onRemove(t.id)}
          aria-label="Cerrar notificación"
        >
          <X size={12} />
        </button>
      </div>
    ))}
  </div>
);
