/**
 * @file shared/components/feedback/LoginScreen.jsx
 * @description Pantalla de login para modo AZURE.
 * En modo PROTO no se muestra (auto-login con usuario demo).
 */
import { useAuth } from '../../../infrastructure/auth/useAuth.jsx';

export const LoginScreen = () => {
  const { login, isLoading } = useAuth();

  return (
    <div style={{
      minHeight:       '100vh',
      background:      'var(--navy)',
      backgroundImage: 'radial-gradient(ellipse 130% 90% at 0% 0%, rgba(0,191,165,.07) 0%, transparent 55%)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      fontFamily:      'var(--font)',
      padding:         16,
    }}>
      <div style={{
        background:   'var(--navy2)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        padding:      '40px 48px',
        maxWidth:     400,
        width:        '100%',
        textAlign:    'center',
        boxShadow:    'var(--sh-lg)',
      }}>
        {/* Logo */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--teal-dk), var(--navy3))',
          border: '1px solid rgba(0,191,165,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 24,
        }}>
          🏦
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: '1.6rem',
          color: 'var(--text-bright)', marginBottom: 6,
        }}>
          Core Access BT
        </h1>
        <p style={{ fontSize: '.76rem', color: 'var(--text-dim)', marginBottom: 28 }}>
          Sistema de Accionistas · BANTRAB
        </p>

        <button
          onClick={login}
          disabled={isLoading}
          style={{
            width:        '100%',
            padding:      '12px 20px',
            background:   'linear-gradient(135deg, var(--teal), var(--teal-dk))',
            color:        'var(--navy)',
            border:       'none',
            borderRadius: 'var(--r)',
            fontSize:     '.82rem',
            fontWeight:   700,
            fontFamily:   'var(--font)',
            cursor:       isLoading ? 'not-allowed' : 'pointer',
            opacity:      isLoading ? .7 : 1,
            display:      'flex',
            alignItems:   'center',
            justifyContent:'center',
            gap:          10,
            boxShadow:    '0 4px 14px rgba(0,191,165,.35)',
            transition:   'all .2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
            <path d="M0 0h10v10H0zM11 0h10v10H11zM0 11h10v10H0zM11 11h10v10H11z" fill="currentColor" fillOpacity=".9"/>
          </svg>
          {isLoading ? 'Iniciando…' : 'Iniciar sesión con Microsoft'}
        </button>

        <p style={{
          fontSize: '.64rem', color: 'var(--text-dim)',
          marginTop: 20, lineHeight: 1.5,
        }}>
          Acceso mediante cuenta institucional de BANTRAB.<br />
          Autenticación con Azure AD / EntraID.
        </p>
      </div>
    </div>
  );
};
