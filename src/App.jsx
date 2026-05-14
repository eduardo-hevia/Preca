/**
 * @file App.jsx
 * @description Raíz: importa estilos, conecta auth y monta el router.
 */
import './shared/styles/global.css';
import './shared/styles/components.css';
import { useAuth }       from './infrastructure/auth/useAuth.jsx';
import { LoginScreen }   from './shared/components/feedback/LoginScreen.jsx';
import { ModeSwitcher }  from './shared/components/feedback/ModeSwitcher.jsx';
import { AppRouter }     from './router/AppRouter.jsx';

function App() {
  const { isAuthenticated, isLoading, mode } = useAuth();

  // Mientras MSAL inicializa
  if (isLoading) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--gray-50)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font)' }}>
        <div style={{ textAlign:'center', color:'var(--text-muted)' }}>
          <div style={{ width:32, height:32, border:'3px solid var(--gray-200)', borderTop:'3px solid var(--teal)', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 14px' }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ fontSize:'.74rem' }}>Iniciando sesión…</p>
        </div>
      </div>
    );
  }

  // En modo AZURE: mostrar login si no está autenticado
  if (mode === 'azure' && !isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <ModeSwitcher />
      </>
    );
  }

  // Proto (siempre autenticado) o Azure (autenticado)
  return (
    <>
      <AppRouter />
      <ModeSwitcher />
    </>
  );
}

export default App;
