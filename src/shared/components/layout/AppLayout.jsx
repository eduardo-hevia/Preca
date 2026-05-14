/**
 * @file shared/components/layout/AppLayout.jsx
 * @description Layout responsivo: sidebar deslizable en mobile + overlay.
 * En desktop: sidebar fijo. En mobile: hidden por defecto, toggle con burger.
 */
import { useState, useCallback, useEffect } from 'react';
import { Outlet }    from 'react-router-dom';
import { Sidebar }   from './Sidebar.jsx';
import { Topbar }    from './Topbar.jsx';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Cierra sidebar al cambiar de ruta (mobile)
  useEffect(() => {
    const handler = () => setSidebarOpen(false);
    window.addEventListener('routechange', handler);
    return () => window.removeEventListener('routechange', handler);
  }, []);

  // Cierra con Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div className="app-shell">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="app-main">
        <Topbar onMenuToggle={openSidebar} />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
