/**
 * Componente de Botón de Autenticación con Google
 *
 * Este componente proporciona un botón estilizado para autenticación con Google OAuth.
 * Maneja la inicialización de Google Identity Services y el callback de autenticación.
 *
 * Props:
 * - text: Texto del botón (ej: "Continuar con Google", "Registrarse con Google")
 * - onSuccess: Callback cuando la autenticación es exitosa
 * - onError: Callback cuando hay error en la autenticación
 * - disabled: Estado deshabilitado del botón
 *
 * @author Codefend Team
 * @version 1.0
 */

import React, { useEffect, useState } from 'react';
import './GoogleAuthButton.scss';
import { googleClientId } from '@/app/data/utils/config';

declare global {
  interface Window {
    google?: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

interface GoogleAuthButtonProps {
  text: string;
  onSuccess: (credential: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  mode?: 'signin' | 'signup';
  showContactsButton?: boolean; // Nueva prop
  onContactsRequest?: (accessToken: string) => void; // Nueva prop
}

export const GoogleAuthButton = ({
  text,
  onSuccess,
  onError,
  disabled = false,
  mode = 'signin',
  showContactsButton = false, // Nueva prop
  onContactsRequest, // Nueva prop
}: GoogleAuthButtonProps) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Nuevo estado

  // 🔧 CONFIGURACIÓN: Cambiar entre One Tap y botón clásico
  // true = One Tap (requiere HTTPS, no funciona en localhost)
  // false = Botón clásico (funciona en localhost)
  const USE_ONE_TAP = false; // Deshabilitado para desarrollo local
  const USE_GSI = true; // Habilitar GSI con configuración correcta

  useEffect(() => {
    // Cargar Google Identity Services si no está cargado
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    } else {
      initializeGoogle();
    }

    return () => {
      // Cleanup: remover el callback global al desmontar
      delete window.handleCredentialResponse;
    };
  }, []);

  const initializeGoogle = () => {
    // console.log('🚀 Inicializando Google Auth con Client ID:', googleClientId);
    // console.log('🔍 DEBUG - Client ID length:', googleClientId.length);

    if (window.google && window.google.accounts) {
      // Configurar el callback global
      window.handleCredentialResponse = (response: any) => {
        // console.log('✅ Google response recibido:', response);
        if (response.credential) {
          onSuccess(response.credential);
          setIsLoggedIn(true); // Actualizar estado de inicio de sesión
        } else {
          console.error('❌ No se recibió credencial de Google:', response);
          onError('No se recibió credencial de Google');
        }
      };

      // Inicializar Google Identity Services
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: window.handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          // Configuración específica para localhost
          context: mode === 'signup' ? 'signup' : 'signin',
          ux_mode: 'popup',
          // Scopes básicos para ID token
          scope: 'openid email profile',
        });
        // console.log('✅ Google Identity Services inicializado correctamente');
        setIsGoogleLoaded(true);

        // Siempre usar botón clásico para desarrollo
        // console.log('✅ Usando botón clásico de Google');
        setTimeout(() => renderGoogleButton(), 100);
      } catch (error) {
        console.error('❌ Error al inicializar Google Identity Services:', error);
        onError('Error al inicializar Google Identity Services');
      }
    } else {
      console.error('❌ Google Identity Services no está disponible');
    }
  };

  const handleGoogleSignIn = () => {
    if (!isGoogleLoaded || disabled) {
      return;
    }

    try {
      // console.log('GOOGLE_AUTH_BUTTON_CLICKED');
      if (USE_ONE_TAP) {
        // console.log('GOOGLE_AUTH_BUTTON_CLICKED_ONE_TAP');
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // console.log('🔄 One Tap falló, usando botón clásico');
            renderGoogleButton();
          }
        });
      } else {
        // console.log('GOOGLE_AUTH_BUTTON_CLICKED_NOT_ONE_TAP');
        renderGoogleButton();
      }
    } catch (error) {
      console.error('❌ Error al inicializar Google Sign-In:', error);
      onError('Error al inicializar Google Sign-In');
    }
  };

  const renderGoogleButton = () => {
    try {
      const buttonContainer = document.getElementById('google-signin-button');

      if (!buttonContainer) {
        console.error('❌ No se encontró el contenedor del botón Google');
        return;
      }

      // Usar renderButton de Google Identity Services
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: mode === 'signup' ? 'signup_with' : 'continue_with',
      });

      // console.log('✅ Botón Google GSI renderizado correctamente');
    } catch (error) {
      console.error('❌ Error en renderGoogleButton:', error);
    }
  };

  const handleRequestContacts = async () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      onError('Google OAuth2 no está disponible');
      return;
    }

    try {
      // console.log('🔄 Solicitando permisos de contactos...');

      const accessToken = await new Promise<string>((resolve, reject) => {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/contacts.readonly',
          callback: (response: any) => {
            // console.log('✅ Access token para contactos obtenido:', response);
            if (response.access_token) {
              resolve(response.access_token);
            } else {
              reject(new Error('No se recibió access token'));
            }
          },
          error_callback: (error: any) => {
            console.error('❌ Error al obtener access token:', error);
            reject(new Error('Error al obtener access token: ' + error.message));
          },
        });

        tokenClient.requestAccessToken();
      });

      // console.log(
      //   '✅ Access token obtenido:',
      //   accessToken ? 'SÍ (' + accessToken.length + ' chars)' : 'NO'
      // );

      if (onContactsRequest) {
        onContactsRequest(accessToken);
      }
    } catch (error) {
      console.error('❌ Error al solicitar contactos:', error);
      onError('Error al solicitar permisos de contactos: ' + (error as Error).message);
    }
  };

  return (
    <div className="google-auth-container">
      {/* Mostrar botón personalizado solo si usamos One Tap */}
      {USE_ONE_TAP && (
        <button
          type="button"
          className={`google-auth-button ${disabled ? 'disabled' : ''}`}
          onClick={handleGoogleSignIn}
          disabled={disabled || !isGoogleLoaded}>
          <div className="google-icon">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"
              />
              <path
                fill="#EA4335"
                d="M8.98 4.72c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.35L4.5 7.42a4.77 4.77 0 0 1 4.48-2.7z"
              />
            </svg>
          </div>
          <span>{isGoogleLoaded ? text : 'Cargando Google...'}</span>
        </button>
      )}

      {/* Mostrar mensaje de carga solo cuando no usamos One Tap y aún no está cargado */}
      {!USE_ONE_TAP && !isGoogleLoaded && (
        <div className="google-loading">
          <span>Cargando Google...</span>
        </div>
      )}

      {/* Contenedor para el botón renderizado por Google - visible para botón clásico */}
      <div
        id="google-signin-button"
        style={{
          display: USE_ONE_TAP ? 'none' : 'block',
          minHeight: USE_ONE_TAP ? 'auto' : '40px',
        }}></div>

      {/* Botón para solicitar permisos de contactos */}
      {showContactsButton && isLoggedIn && (
        <button
          type="button"
          className="google-contacts-button"
          onClick={handleRequestContacts}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#34A853',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}>
          📞 Solicitar permisos de contactos
        </button>
      )}
    </div>
  );
};
