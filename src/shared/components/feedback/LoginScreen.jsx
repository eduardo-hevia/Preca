/**
 * @file shared/components/feedback/LoginScreen.jsx
 * @description Pantalla de login — light theme.
 */
import { useAuth } from '../../../infrastructure/auth/useAuth.jsx';

export const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  return (
    <div style={{
      minHeight:'100vh', background:'var(--gray-50)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--font)', padding:16,
    }}>
      <div style={{
        background:'var(--white)', border:'1px solid var(--border)',
        borderRadius:'var(--r-2xl)', padding:'40px 44px',
        maxWidth:400, width:'100%', textAlign:'center',
        boxShadow:'var(--sh-lg)',
      }}>
        <div style={{
          width:56, height:56, borderRadius:'var(--r-lg)',
          background:'linear-gradient(135deg,var(--teal),var(--teal-dk))',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 20px', fontSize:22,
        }}>🏦</div>
        <h1 style={{ fontFamily:'var(--font)', fontSize:'1.5rem', fontWeight:800, color:'var(--text-primary)', marginBottom:6 }}>
          Core Access BT
        </h1>
        <p style={{ fontSize:'.72rem', color:'var(--text-muted)', marginBottom:28 }}>
          Sistema de Accionistas · BANTRAB
        </p>
        <button onClick={login} disabled={isLoading} className="btn btn--primary" style={{ width:'100%' }}>
          <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
            <path d="M0 0h10v10H0zM11 0h10v10H11zM0 11h10v10H0zM11 11h10v10H11z" fill="currentColor" fillOpacity=".9"/>
          </svg>
          {isLoading ? 'Iniciando…' : 'Iniciar sesión con Microsoft'}
        </button>
        <p style={{ fontSize:'.63rem', color:'var(--text-muted)', marginTop:18, lineHeight:1.5 }}>
          Acceso con cuenta institucional BANTRAB.<br/>Autenticación Azure AD / EntraID.
        </p>
      </div>
    </div>
  );
};
