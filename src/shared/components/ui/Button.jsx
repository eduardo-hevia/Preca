/**
 * @file shared/components/ui/Button.jsx
 * @description Botón del design system Core Access BT.
 * Variantes: primary, outline, danger | Tamaños: sm, md
 */

/**
 * @param {{
 *   variant?: 'primary'|'outline'|'danger',
 *   size?: 'sm'|'md',
 *   icon?: React.ReactNode,
 *   loading?: boolean,
 *   disabled?: boolean,
 *   onClick?: Function,
 *   type?: string,
 *   children: React.ReactNode
 * }} props
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
}) => (
  <button
    type={type}
    className={`btn btn--${variant} btn--${size}`}
    onClick={onClick}
    disabled={disabled || loading}
  >
    {loading ? (
      <span className="btn__spinner" aria-hidden="true" />
    ) : (
      icon && <span className="btn__icon">{icon}</span>
    )}
    {children}
  </button>
);
