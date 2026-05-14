/**
 * @file infrastructure/auth/authConfig.js
 * @description Configuración de autenticación con interruptor PROTO ↔ AZURE.
 *
 * VITE_AUTH_MODE=proto  → Sin login real, usa usuario demo (prototipo)
 * VITE_AUTH_MODE=azure  → Azure AD / EntraID via MSAL
 */

export const AUTH_MODE = import.meta.env.VITE_AUTH_MODE ?? 'proto';

/** Configuración MSAL para Azure AD / EntraID */
export const msalConfig = {
  auth: {
    clientId:    import.meta.env.VITE_AZURE_CLIENT_ID    ?? '',
    authority:   `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID ?? 'common'}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI ?? window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation:     'sessionStorage', // sessionStorage > localStorage para seguridad
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii || import.meta.env.PROD) return;
        if (import.meta.env.VITE_AUTH_MODE === 'proto') return;
        console.debug(`[MSAL] ${message}`);
      },
    },
  },
};

/**
 * Scopes requeridos para acceder a la API de BANTRAB.
 * En Azure AD se define como "App Role" en el registro de la aplicación backend.
 */
export const loginRequest = {
  scopes: [
    `api://${import.meta.env.VITE_AZURE_CLIENT_ID ?? 'your-api-client-id'}/.default`,
  ],
};

/** Usuario de demostración — solo en modo PROTO */
export const DEMO_USER = {
  userId:  'demo-001',
  usuario: 'demo.user@bantrab.com.gt',
  name:    'Usuario Demo',
  roles:   ['Capitalización.Admin', 'Capitalización.Operador'],
  email:   'demo.user@bantrab.com.gt',
};
