/**
 * @file modules/casos-especiales/components/CargaMasivaModal.jsx
 * @description Modal de carga masiva con progreso y resultado detallado.
 * Reemplaza total de registros activos antes de insertar los nuevos.
 * @see HU-61310 Criterio #2 y #3
 */
import { useState } from 'react';
import { Modal }  from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Upload, AlertTriangle } from 'lucide-react';

const MOCK_ROWS = [
  { tipoDocumento: 'DPI',  numeroDocumento: '1111222233301', nombreCompleto: 'DEMO CARGA UNO', estadoId: 3, estadoDesc: 'Denegado', fechaDefuncion: null },
  { tipoDocumento: 'DPI',  numeroDocumento: '4444555566602', nombreCompleto: 'DEMO CARGA DOS', estadoId: 5, estadoDesc: 'Revocado', fechaDefuncion: null },
  { tipoDocumento: '',     numeroDocumento: '',              nombreCompleto: 'FILA CON ERROR', estadoId: 0, estadoDesc: '',         fechaDefuncion: null },
];

const ESTRUCTURA = [
  ['Tipo Documento',   'DPI / Cédula', 'Sí'],
  ['Número Documento', 'string',        'Sí'],
  ['Nombre Completo',  'string',        'Sí'],
  ['Fecha Defunción',  'DD/MM/YYYY',    'Condicional'],
  ['Estado Precal.',   'Código (1-7)', 'Sí'],
];

export const CargaMasivaModal = ({ isOpen, onClose, onCarga }) => {
  const [step,     setStep]     = useState('idle');
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState(null);

  const handleStart = () => {
    setStep('loading');
    setProgress(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setProgress(s * 20);
      if (s >= 5) {
        clearInterval(iv);
        setResult(onCarga(MOCK_ROWS));
        setStep('done');
      }
    }, 600);
  };

  const handleClose = () => {
    setStep('idle');
    setProgress(0);
    setResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Carga Masiva — Casos Especiales"
      subtitle="HU-61310 · Reemplazo total de registros activos"
      size="md"
      footer={
        step === 'done'
          ? <Button variant="primary" onClick={handleClose}>Cerrar</Button>
          : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={step === 'loading'}>Cancelar</Button>
              <Button variant="primary" icon={<Upload size={13} />} onClick={handleStart} disabled={step === 'loading'} loading={step === 'loading'}>
                {step === 'loading' ? 'Procesando…' : 'Iniciar Carga'}
              </Button>
            </>
          )
      }
    >
      <div className="alert alert--warn" style={{ marginBottom: 16 }}>
        <AlertTriangle size={16} />
        <div>
          <strong>Operación: Reemplazo Total</strong>
          <p>Los registros activos serán eliminados lógicamente antes de cargar los nuevos.</p>
        </div>
      </div>

      {step === 'idle' && (
        <>
          <div className="upload-zone">
            <Upload size={36} className="upload-zone__icon" />
            <p className="upload-zone__text">Arrastra tu archivo Excel aquí o haz clic</p>
            <p className="upload-zone__hint">.xlsx · Máx. 10MB</p>
          </div>
          <table className="data-table" style={{ marginTop: 14, fontSize: 11 }}>
            <thead>
              <tr><th>Columna</th><th>Tipo</th><th>Requerido</th></tr>
            </thead>
            <tbody>
              {ESTRUCTURA.map(([col, tipo, req]) => (
                <tr key={col}>
                  <td>{col}</td>
                  <td className="text-muted">{tipo}</td>
                  <td><span className={`badge ${req === 'Sí' ? 'badge--red' : 'badge--amber'} badge--sm`}>{req}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {step === 'loading' && (
        <div className="carga-progress">
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-muted text-sm" style={{ marginTop: 8, textAlign: 'center' }}>
            Procesando… {progress}%
          </p>
        </div>
      )}

      {step === 'done' && result && (
        <div className="carga-result">
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div className="stat-result stat-result--ok">
              <span className="stat-result__val">{result.exitosos}</span>
              <span className="stat-result__label">Exitosos</span>
            </div>
            <div className="stat-result stat-result--err">
              <span className="stat-result__val">{result.rechazados}</span>
              <span className="stat-result__label">Rechazados</span>
            </div>
            <div className="stat-result stat-result--total">
              <span className="stat-result__val">{result.exitosos + result.rechazados}</span>
              <span className="stat-result__label">Total filas</span>
            </div>
          </div>
          {result.errores?.length > 0 && (
            <div className="carga-errors">
              <p className="carga-errors__title">Detalle de errores:</p>
              {result.errores.map((e, i) => (
                <p key={i} className="carga-errors__item">• {e}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
