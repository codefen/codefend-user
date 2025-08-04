import React, { useState } from 'react';
import { GoogleAuthButton } from '../components/GoogleAuthButton/GoogleAuthButton';

const TestGoogleDebug: React.FC = () => {
  const [idToken, setIdToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [debugResult, setDebugResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = (token: string) => {
    setIdToken(token);
  };

  const handleContactsRequest = async (token: string) => {
    setAccessToken(token);
  };

  const runDebug = async () => {
    if (!idToken) {
      alert('Primero obtén un ID token');
      return;
    }

    setLoading(true);
    setDebugResult('');

    try {
      const response = await fetch('https://api.codefend.com/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          model: 'debug_google_registration',
          id_token: idToken,
          access_token: accessToken || ''
        })
      });

      const result = await response.text();
      setDebugResult(result);
    } catch (error) {
      setDebugResult('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🧪 Test Google Debug</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Panel izquierdo - Obtener tokens */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>🔑 Obtener Tokens</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Paso 1: ID Token</h3>
            <GoogleAuthButton 
              text="Obtener ID Token"
              onSuccess={handleGoogleLogin}
              onError={(error) => alert('Error: ' + error)}
              mode="signup"
            />
            {idToken && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#d4edda', 
                borderRadius: '4px',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}>
                <strong>ID Token:</strong> {idToken.substring(0, 50)}...
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Paso 2: Access Token (Opcional)</h3>
            <GoogleAuthButton 
              text="Obtener Access Token"
              onSuccess={handleGoogleLogin}
              onError={(error) => alert('Error: ' + error)}
              mode="signup"
              showContactsButton={true}
              onContactsRequest={handleContactsRequest}
            />
            {accessToken && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#d1ecf1', 
                borderRadius: '4px',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}>
                <strong>Access Token:</strong> {accessToken.substring(0, 50)}...
              </div>
            )}
          </div>

          <button
            onClick={runDebug}
            disabled={!idToken || loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !idToken || loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            {loading ? '🔄 Ejecutando debug...' : '🔍 Ejecutar Debug'}
          </button>
        </div>

        {/* Panel derecho - Resultados */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>📊 Resultados del Debug</h2>
          
          {debugResult ? (
            <div 
              style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                maxHeight: '500px',
                overflow: 'auto',
                fontSize: '14px'
              }}
              dangerouslySetInnerHTML={{ __html: debugResult }}
            />
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#6c757d',
              fontStyle: 'italic'
            }}>
              Ejecuta el debug para ver los resultados
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        <h3>ℹ️ Información del Debug</h3>
        <p><strong>Endpoint:</strong> https://api.codefend.com/index.php</p>
        <p><strong>Model:</strong> debug_google_registration</p>
        <p><strong>Método:</strong> POST (para evitar límites de URL)</p>
        <p><strong>Funcionalidad:</strong> Verificar tokens y obtener contactos paso a paso</p>
      </div>
    </div>
  );
};

export default TestGoogleDebug; 