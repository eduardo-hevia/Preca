/**
 * @file shared/components/layout/Sidebar.jsx
 * @description Sidebar responsivo — deslizable en mobile, fijo en desktop.
 * Acepta props open/onClose para control desde AppLayout.
 */
import { useEffect }    from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Sun, ClipboardList, Settings, LogOut, X } from 'lucide-react';
import { useAuth }      from '../../../infrastructure/auth/useAuth.jsx';

const NAV = [
  { group: 'Módulos', items: [
    { to: '/',              label: 'Dashboard',       icon: <LayoutDashboard size={14}/> },
    { to: '/accionistas',   label: 'Accionistas',     icon: <Users size={14}/> },
    { to: '/expedientes',   label: 'Expedientes',     icon: <FileText size={14}/> },
  ]},
  { group: 'Maestros Asamblea', items: [
    { to: '/precalificacion/estados',   label: 'Estados Precal.',    icon: <Sun size={14}/> },
    { to: '/precalificacion/casos',     label: 'Casos Especiales',   icon: <ClipboardList size={14}/> },
    { to: '/precalificacion/historica', label: 'Cal. Histórica',     icon: <FileText size={14}/> },
    { to: '/precalificacion/reporte',   label: 'Reporte ACCFRM0828', icon: <FileText size={14}/> },
  ]},
  { group: 'Sistema', items: [
    { to: '/configuracion', label: 'Configuración', icon: <Settings size={14}/> },
  ]},
];

export const Sidebar = ({ open, onClose }) => {
  const { logout, user }  = useAuth();
  const { pathname }      = useLocation();

  // Cierra al navegar en mobile
  useEffect(() => { onClose?.(); }, [pathname]); // eslint-disable-line

  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
      {/* Header */}
      <div className="sidebar__logo">
        <div className="sidebar__brand-row">
          <div>
            <div className="sidebar__brand">Core <span>Access BT</span></div>
            <div className="sidebar__sub">BANTRAB · Capitalización</div>
          </div>
          {/* Botón cerrar — solo mobile */}
          <button
            className="sidebar__close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar__nav" aria-label="Menú principal">
        {NAV.map(group => (
          <div key={group.group}>
            <div className="sidebar__section">{group.group}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `sidebar__item${isActive ? ' sidebar__item--active' : ''}`
                }
              >
                <span className="sidebar__item-icon">{item.icon}</span>
                <span className="sidebar__item-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer con usuario */}
      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {user.name?.split(' ').map(p => p[0]).slice(0,2).join('') ?? 'U'}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user.name ?? user.usuario}</div>
              <div className="sidebar__user-role">{user.roles?.[0] ?? 'Operador'}</div>
            </div>
          </div>
        )}
        <button
          className="sidebar__item sidebar__item--logout"
          onClick={logout}
        >
          <span className="sidebar__item-icon"><LogOut size={14}/></span>
          <span className="sidebar__item-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
