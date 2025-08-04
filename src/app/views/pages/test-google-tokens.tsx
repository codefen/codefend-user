import { useState, type FC } from 'react';

const TestGoogleTokens: FC = () => {
  const [idToken, setIdToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testTokens = async () => {
    if (!idToken.trim()) {
      alert('Por favor ingresa el ID token');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('id_token', idToken);
      if (accessToken.trim()) {
        formData.append('access_token', accessToken);
      }

      const response = await fetch('http://localhost/api.codefend.com/debug_google_token.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.text();

      // Parsear la respuesta que puede tener múltiples JSON
      const lines = data.split('\n').filter(line => line.trim());
      const jsonResults = [];

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          jsonResults.push(parsed);
        } catch (e) {
          // Ignorar líneas que no son JSON
        }
      }

      setResult({
        raw: data,
        parsed: jsonResults,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test Google Tokens</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3>ID Token:</h3>
        <textarea
          value={idToken}
          onChange={e => setIdToken(e.target.value)}
          placeholder="Pega el ID token aquí..."
          style={{ width: '100%', height: '100px', fontFamily: 'monospace' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Access Token (opcional):</h3>
        <textarea
          value={accessToken}
          onChange={e => setAccessToken(e.target.value)}
          placeholder="Pega el access token aquí (opcional)..."
          style={{ width: '100%', height: '100px', fontFamily: 'monospace' }}
        />
      </div>

      <button
        onClick={testTokens}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
        {loading ? 'Probando...' : '🧪 Probar Tokens'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultado:</h3>

          {result.error ? (
            <div
              style={{
                color: 'red',
                padding: '10px',
                backgroundColor: '#ffe6e6',
                borderRadius: '5px',
              }}>
              <strong>Error:</strong> {result.error}
            </div>
          ) : (
            <div>
              <h4>Datos Parseados:</h4>
              <pre
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '5px',
                  overflow: 'auto',
                  maxHeight: '400px',
                }}>
                {JSON.stringify(result.parsed, null, 2)}
              </pre>

              <details style={{ marginTop: '10px' }}>
                <summary>Ver respuesta completa</summary>
                <pre
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '5px',
                    overflow: 'auto',
                    maxHeight: '300px',
                    fontSize: '12px',
                  }}>
                  {result.raw}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '5px',
        }}>
        <h3>📋 Instrucciones:</h3>
        <ol>
          <li>
            Ve a{' '}
            <a
              href="https://developers.google.com/oauthplayground/"
              target="_blank"
              rel="noopener noreferrer">
              Google OAuth Playground
            </a>
          </li>
          <li>
            Configura tu Client ID:{' '}
            <code>452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com</code>
          </li>
          <li>
            Selecciona "People API v1" y scope:{' '}
            <code>https://www.googleapis.com/auth/contacts.readonly</code>
          </li>
          <li>Autoriza y obtén el access token</li>
          <li>Pega ambos tokens aquí y prueba</li>
        </ol>
      </div>
    </div>
  );
};

export default TestGoogleTokens;
