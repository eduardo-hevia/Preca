/**
 * @file shared/components/layout/Topbar.jsx
 * @description Topbar responsiva: breadcrumb + usuario real de auth + burger menu.
 */
import { useLocation } from 'react-router-dom';
import { Menu }        from 'lucide-react';
import { useAuth }     from '../../../infrastructure/auth/useAuth.jsx';
import { AUTH_MODE }   from '../../../infrastructure/auth/authConfig.js';

const CRUMBS = {
  '/precalificacion/estados':   ['Maestros Asamblea', 'Estados de Precalificación'],
  '/precalificacion/casos':     ['Maestros Asamblea', 'Casos Especiales'],
  '/precalificacion/historica': ['Maestros Asamblea', 'Calificación Histórica'],
  '/precalificacion/reporte':   ['Maestros Asamblea', 'Reporte ACCFRM0828'],
  '/': ['Dashboard'],
};

export const Topbar = ({ onMenuToggle }) => {
  const { pathname }            = useLocation();
  const { user, logout }        = useAuth();
  const crumbs                  = CRUMBS[pathname] ?? [pathname];
  const initials                = user?.name?.split(' ').map(p => p[0]).slice(0,2).join('') ?? 'U';

  return (
    <header className="topbar">
      {/* Burger — solo mobile */}
      <button
        className="topbar__burger"
        onClick={onMenuToggle}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      <nav className="topbar__breadcrumb" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <span key={c}>
            {i > 0 && <span className="topbar__separator"> › </span>}
            <span className={i === crumbs.length - 1 ? 'topbar__crumb--active' : 'topbar__crumb'}>
              {c}
            </span>
          </span>
        ))}
      </nav>

      <div className="topbar__right">
        {/* Badge de modo — solo dev */}
        {(AUTH_MODE === 'proto' || import.meta.env.DEV) && (
          <div className={`topbar__mode-badge topbar__mode-badge--${AUTH_MODE}`}>
            {AUTH_MODE === 'proto' ? '🔬 PROTO' : '☁️ AZURE'}
          </div>
        )}
        <div className="topbar__chip">SISTEMA ACTIVO</div>
        <div
          className="topbar__avatar"
          title={user?.name ?? 'Usuario'}
          aria-label={user?.name ?? 'Usuario'}
        >
          {initials}
        </div>
        <span className="topbar__username topbar__username--hide-sm">
          {user?.name ?? user?.usuario ?? 'Usuario'}
        </span>
        <button
          className="topbar__logout"
          onClick={logout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          ⏻
        </button>
      </div>
    </header>
  );
};
