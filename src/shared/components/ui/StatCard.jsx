/**
 * @file shared/components/ui/StatCard.jsx
 * @description Tarjeta de estadística con ícono, valor y etiqueta.
 */

/**
 * @param {{
 *   icon: React.ReactNode,
 *   value: string|number,
 *   label: string,
 *   variant?: 'mint'|'blue'|'amber'|'red'|'purple'
 * }} props
 */
export const StatCard = ({ icon, value, label, variant = 'mint' }) => (
  <div className="stat-card">
    <div className={`stat-card__icon stat-card__icon--${variant}`}>{icon}</div>
    <div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  </div>
);
