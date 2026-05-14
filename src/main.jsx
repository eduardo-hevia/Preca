/**
 * @file main.jsx
 * @description Entry point con autenticación dual PROTO ↔ AZURE.
 * Soporta integración como microfrontend via window.__BANTRAB_TOKEN__.
 */
import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import { AUTH_MODE, msalConfig } from './infrastructure/auth/authConfig.js';
import { AuthProvider }          from './infrastructure/auth/useAuth.jsx';
import { setAuthToken }          from './infrastructure/api/httpClient.js';
import App from './App.jsx';

// CX-009 FIX: Validar estructura y expiración del token antes de usarlo
// El backend igualmente verifica la firma — esto es defensa en profundidad
const hostToken = window.__BANTRAB_TOKEN__ ?? null;
if (hostToken && typeof hostToken === 'string') {
  try {
    const parts = hostToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const nowSec  = Math.floor(Date.now() / 1000);
      // Solo aceptar si tiene exp válida y no ha expirado
      if (payload.exp && payload.exp > nowSec && payload.userId) {
        setAuthToken(hostToken);
      }
    }
  } catch {
    // Token malformado — ignorar silenciosamente; el flujo de auth se encargará
  }
}

async function bootstrap() {
  let msalInstance = null;

  if (AUTH_MODE === 'azure') {
    const { PublicClientApplication } = await import('@azure/msal-browser');
    msalInstance = new PublicClientApplication(msalConfig);
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider msalInstance={msalInstance}>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
}

bootstrap().catch(console.error);
