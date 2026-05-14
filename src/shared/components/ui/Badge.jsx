/**
 * @file shared/components/ui/Badge.jsx
 * @description Componente de badge/etiqueta de estado reutilizable.
 * Mapea descripciones de estado a variantes de color del design system.
 */

/** @type {Record<string, string>} Mapa estado → clase de color */
const ESTADO_COLOR_MAP = {
  'Aprobado':                           'badge--green',
  'Nuevo':                              'badge--blue',
  'Denegado':                           'badge--red',
  'Acciones Adquiridas Anómalamente':   'badge--amber',
  'Revocado':                           'badge--purple',
  'Fallecido':                          'badge--gray',
  'Limitación Participación Asamblea':  'badge--teal',
  // Tipos de asamblea
  'Ordinaria':                          'badge--green',
  'Extraordinaria':                     'badge--blue',
  'Mixta':                              'badge--purple',
  // Genéricos
  'base':                               'badge--teal',
  'custom':                             'badge--gray',
  // Fuente motor
  'caso':                               'badge--amber',
  'hist':                               'badge--blue',
  'new':                                'badge--green',
};

/**
 * Badge de estado con punto decorativo
 * @param {{ label: string, variant?: string, size?: 'sm'|'md' }} props
 */
export const Badge = ({ label, variant, size = 'md' }) => {
  const colorClass = ESTADO_COLOR_MAP[variant ?? label] ?? 'badge--gray';
  return (
    <span className={`badge ${colorClass} badge--${size}`}>
      {label}
    </span>
  );
};
