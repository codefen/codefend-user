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
import { ENV } from '@/app/constants/env';

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
}

export const GoogleAuthButton = ({ 
  text, 
  onSuccess, 
  onError, 
  disabled = false,
  mode = 'signin'
}: GoogleAuthButtonProps) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  
  // 🔧 CONFIGURACIÓN: Cambiar entre One Tap y botón clásico
  // true = One Tap (requiere HTTPS, no funciona en localhost)
  // false = Botón clásico (funciona en localhost)
  const USE_ONE_TAP = false;

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
    // Depuración: mostrar el client_id en consola para verificar que es el correcto
    console.log('Google Client ID usado:', ENV.GOOGLE_CLIENT_ID);
    // Depuración adicional: mostrar origen actual y URL completa
    console.log('Origen actual (window.location.origin):', window.location.origin);
    console.log('URL completa (window.location.href):', window.location.href);
    console.log('Protocol:', window.location.protocol);
    console.log('Hostname:', window.location.hostname);
    console.log('Port:', window.location.port);
    
    if (window.google && window.google.accounts) {
      // Configurar el callback global
      window.handleCredentialResponse = (response: any) => {
        console.log('✅ Google response recibido:', response);
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          console.error('❌ No se recibió credencial de Google:', response);
          onError('No se recibió credencial de Google');
        }
      };

      // Inicializar Google Identity Services
      console.log('🚀 Inicializando Google Identity Services...');
      try {
        window.google.accounts.id.initialize({
          client_id: ENV.GOOGLE_CLIENT_ID,
          callback: window.handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        console.log('✅ Google Identity Services inicializado correctamente');
        setIsGoogleLoaded(true);
        
        if (USE_ONE_TAP) {
          // MODO ONE TAP: Para producción con HTTPS
          console.log('🚀 Modo One Tap: Mostrando prompt automático...');
          window.google.accounts.id.prompt((notification: any) => {
            console.log('📋 Google prompt notification:', notification);
            console.log('isNotDisplayed():', notification.isNotDisplayed?.());
            console.log('isSkippedMoment():', notification.isSkippedMoment?.());
            console.log('getDismissedReason():', notification.getDismissedReason?.());
            console.log('getNotDisplayedReason():', notification.getNotDisplayedReason?.());
            console.log('getSkippedReason():', notification.getSkippedReason?.());
            
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log('🔄 Prompt no se mostró, fallback a botón clásico...');
              renderGoogleButton();
            }
          });
        } else {
          // MODO BOTÓN CLÁSICO: Para desarrollo local (localhost)
          console.log('🔄 Modo botón clásico: desarrollo local...');
          renderGoogleButton();
        }
      } catch (error) {
        console.error('❌ Error al inicializar Google Identity Services:', error);
        onError('Error al inicializar Google Identity Services');
      }
    } else {
      console.error('❌ Google Identity Services no está disponible');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('🔵 handleGoogleSignIn llamado');
    console.log('isGoogleLoaded:', isGoogleLoaded);
    console.log('disabled:', disabled);
    
    if (!isGoogleLoaded || disabled) {
      console.log('❌ Google no está cargado o botón deshabilitado');
      return;
    }

    try {
      if (USE_ONE_TAP) {
        console.log('🚀 Mostrando prompt de Google...');
        window.google.accounts.id.prompt((notification: any) => {
          console.log('📋 Google prompt notification:', notification);
          console.log('isNotDisplayed():', notification.isNotDisplayed?.());
          console.log('isSkippedMoment():', notification.isSkippedMoment?.());
          console.log('getDismissedReason():', notification.getDismissedReason?.());
          console.log('getNotDisplayedReason():', notification.getNotDisplayedReason?.());
          console.log('getSkippedReason():', notification.getSkippedReason?.());
          
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('🔄 Prompt no se mostró, intentando con renderButton...');
            renderGoogleButton();
          }
        });
      } else {
        console.log('🔄 Desarrollo local: usando botón clásico directamente...');
        renderGoogleButton();
      }
    } catch (error) {
      console.error('❌ Error al inicializar Google Sign-In:', error);
      onError('Error al inicializar Google Sign-In');
    }
  };

  const renderGoogleButton = () => {
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        // Google solo acepta valores numéricos para width, no porcentajes. Cambiado de '100%' a 300 para evitar advertencias y errores.
        width: 300,
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
      }
    );
  };

  return (
    <div className="google-auth-container">
      <button
        type="button"
        className={`google-auth-button ${disabled ? 'disabled' : ''}`}
        onClick={handleGoogleSignIn}
        disabled={disabled || !isGoogleLoaded}
      >
        <div className="google-icon">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"/>
            <path fill="#EA4335" d="M8.98 4.72c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.35L4.5 7.42a4.77 4.77 0 0 1 4.48-2.7z"/>
          </svg>
        </div>
        <span>{isGoogleLoaded ? text : 'Cargando Google...'}</span>
      </button>
      
      {/* Contenedor oculto para el botón renderizado por Google */}
      <div id="google-signin-button" style={{ display: 'none' }}></div>
    </div>
  );
}; 