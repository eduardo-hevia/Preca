/**
 * @file router/AppRouter.jsx
 * @description Configuración de rutas con React Router v6.
 * Todas las páginas del módulo Precalificación se anidan bajo AppLayout.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout }   from '../shared/components/layout/AppLayout';
import { EstadosPrecalificacionPage }  from '../modules/estados-precalificacion/components/EstadosPrecalificacionPage';
import { CasosEspecialesPage }         from '../modules/casos-especiales/components/CasosEspecialesPage';
import { CalificacionHistoricaPage }   from '../modules/calificacion-historica/components/CalificacionHistoricaPage';
import { ReporteExpedientesPage }      from '../modules/reporte-expedientes/components/ReporteExpedientesPage';

/** Página placeholder para rutas no implementadas en el prototipo */
const Placeholder = ({ title }) => (
  <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
    <p style={{ fontSize: 13 }}>Módulo no implementado en este prototipo.</p>
  </div>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        {/* Dashboard */}
        <Route index element={<Placeholder title="Dashboard" />} />

        {/* Módulos externos (placeholder) */}
        <Route path="accionistas"   element={<Placeholder title="Accionistas" />} />
        <Route path="expedientes"   element={<Placeholder title="Expedientes" />} />
        <Route path="configuracion" element={<Placeholder title="Configuración" />} />

        {/* ── MÓDULO PRECALIFICACIÓN ─────────────────── */}
        <Route path="precalificacion">
          {/* Redirige /precalificacion → /precalificacion/estados */}
          <Route index element={<Navigate to="estados" replace />} />

          {/* HU-61309 */}
          <Route path="estados"   element={<EstadosPrecalificacionPage />} />

          {/* HU-61310 */}
          <Route path="casos"     element={<CasosEspecialesPage />} />

          {/* HU-61314 */}
          <Route path="historica" element={<CalificacionHistoricaPage />} />

          {/* HU-61568 */}
          <Route path="reporte"   element={<ReporteExpedientesPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
