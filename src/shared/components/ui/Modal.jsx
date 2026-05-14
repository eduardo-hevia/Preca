/**
 * @file shared/components/ui/Modal.jsx
 * @description Modal accesible con overlay, animación y cierre por backdrop.
 * Soporta tamaños configurables.
 */
import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: Function,
 *   title: string,
 *   subtitle?: string,
 *   size?: 'sm'|'md'|'lg',
 *   footer?: React.ReactNode,
 *   children: React.ReactNode
 * }} props
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  footer,
  children,
}) => {
  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <div
      className={`modal-overlay ${isOpen ? 'modal-overlay--open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`modal modal--${size} ${isOpen ? 'anim-scale-in' : ''}`}>
        {/* Header */}
        <div className="modal__header">
          <div>
            <h2 className="modal__title">{title}</h2>
            {subtitle && <p className="modal__subtitle">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">{children}</div>

        {/* Footer opcional */}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
};
