/**
 * @file infrastructure/auth/useAuth.js
 * @description Hook de autenticación unificado.
 *
 * MODO PROTO : usa usuario demo, sin login real.
 * MODO AZURE : usa MSAL para Azure AD / EntraID.
 *
 * Expone la misma interfaz en ambos modos para que los componentes
 * sean transparentes al método de autenticación.
 */
import { useState, useCallback, useEffect, useContext, createContext } from 'react';
import { AUTH_MODE, DEMO_USER, loginRequest } from './authConfig.js';
import { setAuthToken, clearAuthToken } from '../api/httpClient.js';

/* ── Context ─────────────────────────────────────────── */
const AuthContext = createContext(null);

/**
 * @typedef {{
 *   user: object|null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   mode: 'proto'|'azure',
 *   login: Function,
 *   logout: Function,
 * }} AuthContextValue
 */

/**
 * Provider de autenticación.
 * Envuelve la app y gestiona el estado de sesión.
 */
export const AuthProvider = ({ children, msalInstance }) => {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ── MODO PROTO: obtiene token firmado del backend ── */
  // CX-003 FIX: El token proto ahora se solicita al endpoint /api/v1/auth/proto-login
  // que lo firma con JWT_SECRET real. Reemplaza la generación local con btoa().
  useEffect(() => {
    if (AUTH_MODE !== 'proto') return;
    const fetchProtoToken = async () => {
      try {
        // Determina la URL base automáticamente (igual que en httpClient.js)
        const getBaseURL = () => {
          const envUrl = import.meta.env.VITE_API_BASE_URL;
          if (envUrl) return envUrl;
          // En desarrollo (Vite en puerto 5173)
          if (window.location.hostname === 'localhost' && window.location.port === '5173') {
            return 'http://localhost:3001/api/v1';
          }
          // En producción: usa el mismo servidor/dominio actual
          return `${window.location.origin}/api/v1`;
        };
        
        const apiBase = getBaseURL();
        const res  = await fetch(`${apiBase}/auth/proto-login`, { method: 'POST' });
        if (res.ok) {
          const { token } = await res.json();
          setAuthToken(token);
        }
        // Independientemente del token, setea el usuario demo en la UI
      } catch {
        // Si el backend no está disponible en proto, continúa sin token (modo offline)
      } finally {
        setUser(DEMO_USER);
        setIsLoading(false);
      }
    };
    fetchProtoToken();
  }, []);

  /* ── MODO AZURE: inicializa MSAL ─────────────────── */
  useEffect(() => {
    if (AUTH_MODE !== 'azure' || !msalInstance) return;

    const init = async () => {
      setIsLoading(true);
      try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          await _refreshAzureToken(msalInstance, accounts[0], setUser);
        }
      } catch (err) {
        console.error('[Auth] MSAL init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [msalInstance]);

  /* ── Login ───────────────────────────────────────── */
  const login = useCallback(async () => {
    if (AUTH_MODE === 'proto') {
      // Proto: ya autenticado, no-op
      return;
    }
    // Azure: redirige al login de Microsoft
    await msalInstance.loginRedirect(loginRequest);
  }, [msalInstance]);

  /* ── Logout ──────────────────────────────────────── */
  const logout = useCallback(async () => {
    clearAuthToken();
    setUser(null);

    if (AUTH_MODE === 'azure' && msalInstance) {
      const account = msalInstance.getAllAccounts()[0];
      await msalInstance.logoutRedirect({ account });
    }
  }, [msalInstance]);

  /* ── Refresh token periódico (Azure) ─────────────── */
  useEffect(() => {
    if (AUTH_MODE !== 'azure' || !msalInstance || !user) return;
    // Renueva el token 5 min antes de expirar (cada 50 min)
    const interval = setInterval(async () => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await _refreshAzureToken(msalInstance, accounts[0], setUser);
      }
    }, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [msalInstance, user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    mode: AUTH_MODE,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook para consumir el contexto de auth */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};

/* ── Helpers privados ────────────────────────────────── */


/**
 * Adquiere silenciosamente el access token de Azure y lo inyecta en el cliente HTTP.
 */
async function _refreshAzureToken(msalInstance, account, setUser) {
  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
    setAuthToken(response.accessToken);
    setUser({
      userId:  account.localAccountId,
      usuario: account.username,
      name:    account.name ?? account.username,
      email:   account.username,
      roles:   response.idTokenClaims?.roles ?? [],
      groups:  response.idTokenClaims?.groups ?? [],
    });
  } catch (err) {
    console.warn('[Auth] Silent token refresh failed:', err.message);
    clearAuthToken();
    setUser(null);
  }
}
