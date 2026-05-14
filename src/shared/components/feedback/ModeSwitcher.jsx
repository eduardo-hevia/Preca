/**
 * @file shared/components/feedback/ModeSwitcher.jsx
 * @description Interruptor PROTO ↔ AZURE — light theme.
 */
import { AUTH_MODE } from '../../../infrastructure/auth/authConfig.js';

const SHOW = import.meta.env.VITE_SHOW_MODE_SWITCHER === 'true' || import.meta.env.DEV;

export const ModeSwitcher = () => {
  if (!SHOW) return null;
  const isProto = AUTH_MODE === 'proto';
  const toggle = () => alert(
    isProto
      ? '🔄 Para modo AZURE:\nVITE_AUTH_MODE=azure\nVITE_USE_MOCK=false\nReinicia: npm run dev'
      : '🔄 Para modo PROTO:\nVITE_AUTH_MODE=proto\nVITE_USE_MOCK=true\nReinicia: npm run dev',
  );
  return (
    <button onClick={toggle} className="mode-switcher" aria-label={`Modo: ${isProto ? 'Prototipo' : 'Azure'}`}>
      <span>{isProto ? '🔬' : '☁️'}</span>
      <span>{isProto ? 'PROTO' : 'AZURE'}</span>
    </button>
  );
};
