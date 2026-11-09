import { useState, type FC } from 'react';
import { GoogleAuthButton } from '../GoogleAuthButton/GoogleAuthButton';

interface GoogleRegistrationProps {
  onRegistrationComplete: (userData: any) => void;
  onError: (error: string) => void;
}

export const GoogleRegistration: FC<GoogleRegistrationProps> = ({
  onRegistrationComplete,
  onError,
}) => {
  const [idToken, setIdToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState<'login' | 'contacts' | 'registering'>('login');

  const handleGoogleLogin = (token: string) => {
    // console.log('✅ Google login exitoso');
    setIdToken(token);
    setStep('contacts');
  };

  const handleContactsRequest = async (token: string) => {
    // console.log('📞 Access token para contactos recibido:', token ? 'SÍ (' + token.length + ' chars)' : 'NO');
    setAccessToken(token);

    // Proceder con el registro
    await handleRegistration(token);
  };

  const handleRegistration = async (contactsToken: string) => {
    setIsRegistering(true);
    setStep('registering');

    try {
      // console.log('🚀 Iniciando registro con Google...');

      const response = await fetch('https://api.codefend.com/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          model: 'users/new',
          phase: '1',
          auth_provider: 'google',
          id_token: idToken,
          access_token: contactsToken,
          reseller_id: '1', // Valor por defecto
          reseller_name: 'Direct', // Valor por defecto
          idiom: 'en', // Valor por defecto
        }),
      });

      const result = await response.json();
      // console.log('📄 Respuesta del registro:', result);

      if (result.error === '0') {
        // console.log('✅ Registro exitoso');
        onRegistrationComplete(result);
      } else {
        // console.error('❌ Error en registro:', result.info);
        onError(result.info || 'Error en el registro');
      }
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      onError('Error al registrar usuario: ' + (error as Error).message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSkipContacts = async () => {
    // console.log('⏭️ Saltando obtención de contactos');
    await handleRegistration('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Registro con Google</h2>

      {step === 'login' && (
        <div>
          <p>Paso 1: Inicia sesión con Google</p>
          <GoogleAuthButton
            text="Continuar con Google"
            onSuccess={handleGoogleLogin}
            onError={onError}
            mode="signup"
          />
        </div>
      )}

      {step === 'contacts' && (
        <div>
          <p>Paso 2: Obtener contactos (opcional)</p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Podemos obtener tus contactos de Gmail para mejorar tu experiencia. Esto es
            completamente opcional.
          </p>

          <GoogleAuthButton
            text="Continuar con Google"
            onSuccess={handleGoogleLogin}
            onError={onError}
            mode="signup"
            showContactsButton={true}
            onContactsRequest={handleContactsRequest}
          />

          <button
            onClick={handleSkipContacts}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%',
            }}>
            ⏭️ Continuar sin contactos
          </button>
        </div>
      )}

      {step === 'registering' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
              }}></div>
          </div>
          <p>🔄 Registrando usuario...</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {accessToken ? 'Obteniendo contactos de Gmail...' : 'Creando cuenta...'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
