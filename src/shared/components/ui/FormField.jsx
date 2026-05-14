/**
 * @file shared/components/ui/FormField.jsx
 * @description Campo de formulario con label, validación y mensaje de error.
 * Soporta input, select y textarea.
 */

/**
 * @param {{
 *   label: string,
 *   required?: boolean,
 *   error?: string,
 *   hint?: string,
 *   children: React.ReactNode
 * }} props
 */
export const FormField = ({ label, required = false, error, hint, children }) => (
  <div className="form-field">
    <label className="form-field__label">
      {label}
      {required && <span className="form-field__req" aria-hidden="true"> *</span>}
    </label>
    {children}
    {error && (
      <p className="form-field__error" role="alert">
        {error}
      </p>
    )}
    {hint && !error && <p className="form-field__hint">{hint}</p>}
  </div>
);

/**
 * Input estándar del design system
 * @param {{ error?: boolean } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export const Input = ({ error, className = '', ...props }) => (
  <input
    className={`form-control ${error ? 'form-control--error' : ''} ${className}`}
    {...props}
  />
);

/**
 * Select estándar del design system
 * @param {{ error?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>} props
 */
export const Select = ({ error, className = '', children, ...props }) => (
  <select
    className={`form-control ${error ? 'form-control--error' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);
