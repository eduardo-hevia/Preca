/**
 * @file shared/components/feedback/ModeSwitcher.jsx
 * @description Interruptor visual PROTO ↔ AZURE.
 * Solo visible en desarrollo (VITE_SHOW_MODE_SWITCHER=true).
 * Permite al equipo alternar modos sin cambiar variables de entorno.
 */
import { AUTH_MODE } from '../../../infrastructure/auth/authConfig.js';

const SHOW = import.meta.env.VITE_SHOW_MODE_SWITCHER === 'true'
          || import.meta.env.DEV;

export const ModeSwitcher = () => {
  if (!SHOW) return null;

  const isProto = AUTH_MODE === 'proto';

  const toggle = () => {
    // Cambia la variable y recarga — Vite inyecta en build time,
    // así que el cambio real requiere reiniciar con la env distinta.
    // Este botón muestra la instrucción al developer.
    alert(
      isProto
        ? '🔄 Para cambiar a modo AZURE:\n\nEn .env.development:\nVITE_AUTH_MODE=azure\nVITE_USE_MOCK=false\n\nLuego reinicia: npm run dev'
        : '🔄 Para cambiar a modo PROTO:\n\nEn .env.development:\nVITE_AUTH_MODE=proto\nVITE_USE_MOCK=true\n\nLuego reinicia: npm run dev',
    );
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Modo actual: ${isProto ? 'Prototipo' : 'Azure'}`}
      style={{
        position:       'fixed',
        bottom:         16,
        right:          16,
        zIndex:         9999,
        display:        'flex',
        alignItems:     'center',
        gap:            8,
        padding:        '7px 13px',
        borderRadius:   8,
        border:         `1px solid ${isProto ? 'rgba(249,168,37,.4)' : 'rgba(0,191,165,.4)'}`,
        background:     isProto ? 'rgba(249,168,37,.12)' : 'rgba(0,191,165,.12)',
        color:          isProto ? '#fbbf24' : '#4DD0C4',
        fontSize:       11,
        fontFamily:     "'DM Mono', monospace",
        fontWeight:     600,
        cursor:         'pointer',
        letterSpacing:  '0.5px',
        backdropFilter: 'blur(6px)',
        boxShadow:      '0 4px 16px rgba(0,0,0,.3)',
        transition:     'all .2s',
        textTransform:  'uppercase',
      }}
      title="Haz clic para ver cómo cambiar de modo"
    >
      <span style={{ fontSize: 14 }}>{isProto ? '🔬' : '☁️'}</span>
      <span>{isProto ? 'PROTO' : 'AZURE'}</span>
      <span style={{ opacity: .6, fontSize: 10 }}>↔ click</span>
    </button>
  );
};
