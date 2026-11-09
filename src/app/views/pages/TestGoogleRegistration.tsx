import { useState, type FC } from 'react';
import { GoogleRegistration } from '../components/GoogleRegistration/GoogleRegistration';

const TestGoogleRegistration: FC = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleRegistrationComplete = (userData: any) => {
    console.log('✅ Registro completado:', userData);
    setResult(userData);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    console.error('❌ Error en registro:', errorMessage);
    setError(errorMessage);
    setResult(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test Google Registration</h1>

      {!result && !error && (
        <GoogleRegistration
          onRegistrationComplete={handleRegistrationComplete}
          onError={handleError}
        />
      )}

      {error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}>
          ❌ {error}
          <button
            onClick={() => setError('')}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}>
            Reintentar
          </button>
        </div>
      )}

      {result && (
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
          }}>
          <h3>✅ Registro Exitoso</h3>
          <p>
            <strong>Usuario:</strong> {result.user?.fname} {result.user?.lname}
          </p>
          <p>
            <strong>Email:</strong> {result.user?.email}
          </p>
          <p>
            <strong>Contactos obtenidos:</strong> {result.user?.gmail_contacts ? 'SÍ' : 'NO'}
          </p>
          {result.user?.gmail_contacts && (
            <p>
              <strong>Total de contactos:</strong> {JSON.parse(result.user.gmail_contacts).length}
            </p>
          )}
          <p>
            <strong>Necesita onboarding:</strong> {result.needs_onboarding ? 'SÍ' : 'NO'}
          </p>

          <button
            onClick={() => {
              setResult(null);
              setError('');
            }}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#155724',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
            Registrar otro usuario
          </button>
        </div>
      )}

      <div
        style={{
          backgroundColor: '#e9ecef',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
        }}>
        <h3>ℹ️ Información del Test</h3>
        <p>
          <strong>Endpoint:</strong> https://api.codefend.com/index.php
        </p>
        <p>
          <strong>Model:</strong> users/new
        </p>
        <p>
          <strong>Phase:</strong> 1
        </p>
        <p>
          <strong>Funcionalidad:</strong> Registro completo con Google + obtención de contactos
        </p>
        <p>
          <strong>Contactos:</strong> Opcional (se pueden saltar)
        </p>
      </div>
    </div>
  );
};

export default TestGoogleRegistration;
