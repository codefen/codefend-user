import React, { useState } from 'react';
import { GoogleAuthButton } from '../components/GoogleAuthButton/GoogleAuthButton';

const TestGoogleContacts: React.FC = () => {
  const [idToken, setIdToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleGoogleLogin = (token: string) => {
    setIdToken(token);
    setSuccess('ID Token obtenido: ' + token.substring(0, 50) + '...');
    setError('');
  };

  const testPeopleAPI = async (token: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // console.log('🔄 Probando People API...');

      // Llamar al endpoint de la API
      const response = await fetch('https://api.codefend.com/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `model=test_people_api&access_token=${encodeURIComponent(token)}`,
      });

      const result = await response.text();
      // console.log('📄 Respuesta del script de debug:', result);

      if (response.ok) {
        try {
          const data = JSON.parse(result);
          if (data.success) {
            setContacts(data.contacts || []);
            setSuccess(`✅ Contactos obtenidos: ${data.contacts?.length || 0} contactos`);
          } else {
            setError(`❌ Error: ${data.error || 'Error desconocido'}`);
          }
        } catch (parseError) {
          setError('❌ Error parseando respuesta del servidor');
        }
      } else {
        setError(`❌ Error HTTP: ${response.status} - ${result}`);
      }
    } catch (err) {
      console.error('❌ Error en People API:', err);
      setError('❌ Error en People API: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualTokenTest = () => {
    if (accessToken.trim()) {
      testPeopleAPI(accessToken);
    } else {
      setError('❌ Por favor ingresa un access token válido');
    }
  };

  const openOAuthPlayground = () => {
    window.open('https://developers.google.com/oauthplayground/', '_blank');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test Google Contacts</h1>

      {/* Paso 1: Login con Google */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}>
        <h2>Paso 1: Login con Google</h2>
        <GoogleAuthButton
          text="Continue with Google"
          onSuccess={handleGoogleLogin}
          onError={error => setError('❌ Error en Google login: ' + error)}
          mode="signin"
        />

        {success && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              color: '#155724',
            }}>
            ✅ {success}
          </div>
        )}
      </div>

      {/* Paso 2: Obtener Access Token */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}>
        <h2>Paso 2: Obtener Access Token</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3>🚀 Opción 1: Google OAuth Playground (Recomendado)</h3>
          <p>
            El popup está siendo bloqueado por el navegador. Usa Google OAuth Playground para
            obtener un access token válido:
          </p>

          <button
            onClick={openOAuthPlayground}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '15px',
            }}>
            🔗 Abrir Google OAuth Playground
          </button>

          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
            }}>
            <h4>📋 Instrucciones paso a paso:</h4>
            <ol style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Haz clic en "Abrir Google OAuth Playground"</li>
              <li>
                En la página que se abre, haz clic en el ícono de configuración (⚙️) en la esquina
                superior derecha
              </li>
              <li>Marca la casilla "Use your own OAuth credentials"</li>
              <li>
                Ingresa tu Client ID:{' '}
                <code>
                  452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com
                </code>
              </li>
              <li>Haz clic en "Close"</li>
              <li>
                En la lista de APIs, busca y selecciona:{' '}
                <code>https://www.googleapis.com/auth/contacts.readonly</code>
              </li>
              <li>Haz clic en "Authorize APIs"</li>
              <li>Selecciona tu cuenta de Google y autoriza</li>
              <li>Haz clic en "Exchange authorization code for tokens"</li>
              <li>Copia el "Access token" que aparece</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🧪 Opción 2: Testing Manual</h3>
          <p>Pega el access token obtenido del OAuth Playground:</p>

          <input
            type="text"
            value={accessToken}
            onChange={e => setAccessToken(e.target.value)}
            placeholder="Pega aquí el access token del OAuth Playground..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          />

          <button
            onClick={handleManualTokenTest}
            disabled={loading}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: loading ? 0.6 : 1,
            }}>
            {loading ? '🔄 Probando...' : '🧪 Probar con Token Manual'}
          </button>
        </div>
      </div>

      {/* Resultados */}
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
        </div>
      )}

      {contacts.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}>
          <h2>📞 Contactos Obtenidos ({contacts.length})</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {contacts.map((contact, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  border: '1px solid #eee',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                }}>
                <strong>Nombre:</strong> {contact.name || 'Sin nombre'}
                <br />
                <strong>Emails:</strong> {contact.emails?.join(', ') || 'Sin emails'}
                <br />
                <strong>Teléfonos:</strong> {contact.phones?.join(', ') || 'Sin teléfonos'}
                <br />
                <strong>Organización:</strong> {contact.organization || 'Sin organización'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div
        style={{
          backgroundColor: '#e9ecef',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
        }}>
        <h3>ℹ️ Información de Debug</h3>
        <p>
          <strong>Client ID:</strong>{' '}
          452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com
        </p>
        <p>
          <strong>Scope necesario:</strong> https://www.googleapis.com/auth/contacts.readonly
        </p>
        <p>
          <strong>API endpoint:</strong> https://people.googleapis.com/v1/people/me/connections
        </p>
        <p>
          <strong>Problema actual:</strong> El popup está siendo bloqueado por políticas de
          seguridad del navegador
        </p>
      </div>
    </div>
  );
};

export default TestGoogleContacts;
