/**
 * Hook de Autenticación con Google OAuth
 *
 * Este hook maneja toda la lógica de autenticación con Google,
 * incluyendo login y registro de usuarios.
 *
 * Funcionalidades:
 * - Login con Google (usuarios existentes)
 * - Registro con Google (usuarios nuevos)
 * - Integración con backend de Codefend
 * - Manejo de errores y estados de carga
 *
 * Backend integration:
 * - POST /users/google/login (login existente)
 * - POST /users/new (registro con Google)
 *
 * @author Codefend Team
 * @version 1.0
 */

import { useFetcher } from '#commonHooks/useFetcher';
import { useState } from 'react';
import { toast } from '@/app/data/utils';
import { apiErrorValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useSessionManager } from './useSessionManager';
import { useInitialDomainStore } from '@/app/data/store/initialDomain.store';
import { googleClientId } from '@/app/data/utils/config';

export const useGoogleAuth = () => {
  const [fetcher] = useFetcher();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSuccessfulLogin } = useSessionManager();
  const { update: updateInitialDomain } = useInitialDomainStore();
  
  // 🔍 DEBUG: Verificar Client ID al cargar el hook
  console.log('🔍 DEBUG - Hook loaded, Google Client ID:', googleClientId);
  console.log('🔍 DEBUG - Client ID length:', googleClientId.length);

  /**
   * Intenta hacer login con Google para usuarios existentes
   */
  const googleLogin = async (idToken: string): Promise<any> => {
    setIsLoading(true);
    // console.log('🚀 Google Login - Iniciando login con Google');
    try {
      const { data } = await fetcher('post', {
        body: {
          id_token: idToken,
          model: 'users/google/login',
        },
        requireSession: false,
      });
      // console.log('TREASEDASDASD', { data });

      if (apiErrorValidation(data) || (data as any)?.response === 'register_required') {
        // Si hay error de validación, podría ser usuario no registrado
        throw new Error((data as any)?.info || 'Error al iniciar sesión con Google');
      }

      // Login exitoso
      // Para usuarios de Google OAuth (que suelen ser personales), limpiar el store
      updateInitialDomain('initialDomain', '');
      updateInitialDomain('scopeType', 'email');
      // console.log('🧹 Google Login - Store limpiado y configurado para email');

      const user = handleSuccessfulLogin(data);
      return {
        success: true,
        user,
        message: 'Sesión iniciada exitosamente con Google',
      };
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
      return { error: error.message, success: false, user: null };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario con Google OAuth
   */
  const googleSignup = async (idToken: string): Promise<any> => {
    try {
      console.log('🚀 Iniciando registro con Google OAuth...');
      
      // Obtener access token real para contactos
      const accessToken = await getAccessTokenForContacts(idToken);
      
      console.log('✅ Access token obtenido para contactos: SÍ (' + accessToken.length + ' chars)');
      
      // Preparar datos para el backend
      const registrationData = {
        model: 'users/new',
        phase: '1',
        auth_provider: 'google',
        id_token: idToken,
        access_token: accessToken,
        lead_fname: '',
        lead_lname: '',
        lead_email: '',
        lead_phone: '',
        reseller_id: '0',
        reseller_name: 'direct',
        idiom: 'en',
        personal_user: '1'
      };
      
      console.log('🚀 Enviando datos de registro:', {
        ...registrationData,
        id_token: 'PRESENTE',
        access_token: 'PRESENTE'
      });
      
      // Enviar al backend usando fetcher
      const { data: leadData } = await fetcher('post', {
        body: registrationData,
        requireSession: false,
      });
      
      if (apiErrorValidation(leadData)) {
        throw new Error((leadData as any)?.info || 'Error al crear cuenta con Google');
      }
      
      // 🔍 DEBUG: PAUSAR AQUÍ PARA VER LA RESPUESTA COMPLETA
      console.log('🔍 DEBUG - Respuesta completa del backend:', leadData);
      console.log('🔍 DEBUG - ¿Tiene sesión?', !!(leadData as any)?.session);
      console.log('🔍 DEBUG - ¿Necesita onboarding?', !!(leadData as any)?.needs_onboarding);
      
      // El backend ya maneja automáticamente las fases 2 y 3 para Google OAuth
      // Si hay sesión, significa que se creó el usuario automáticamente
      if ((leadData as any)?.session) {
        // Verificar si necesita onboarding ANTES de hacer login
        if ((leadData as any)?.needs_onboarding) {
          // Guardar datos temporales para el onboarding
          localStorage.setItem('onboarding_data', JSON.stringify(leadData));
          localStorage.setItem(
            'temp_session_data',
            JSON.stringify({ session: (leadData as any).session })
          );

          console.log('🚀 Google OAuth - Datos temporales guardados para onboarding');

          return {
            success: true,
            user: (leadData as any).user,
            needs_onboarding: true,
            data: leadData,
            message: 'Cuenta creada exitosamente con Google. Completa tu perfil.',
          };
        } else {
          // Si no necesita onboarding, proceder con login normal
          // Para usuarios de Google OAuth (que son personales por defecto), limpiar el store
          updateInitialDomain('initialDomain', '');
          updateInitialDomain('scopeType', 'email');
          console.log(
            '🧹 Google OAuth - Usuario personal, store limpiado y configurado para email'
          );

          const user = handleSuccessfulLogin(leadData);
          return {
            success: true,
            user,
            message: 'Cuenta creada e iniciada sesión exitosamente con Google',
          };
        }
      }

      // Si no hay sesión, devolver datos del lead para posible fase 4
      return {
        success: true,
        lead: (leadData as any).leads,
        message: 'Cuenta creada exitosamente con Google',
      };
    } catch (error) {
      console.error('❌ Error en googleSignup:', error);
      throw error;
    }
  };

  /**
   * Maneja la respuesta de Google OAuth (login o registro)
   */
  const handleGoogleAuth = async (
    idToken: string,
    mode: 'signin' | 'signup' = 'signin'
  ): Promise<any> => {
    if (mode === 'signin') {
      // console.log('🚀 Google Auth - Iniciando login con Google');
      const loginResult = await googleLogin(idToken);

      // Si el login falla porque el usuario no existe, intentar registro automático
      if (loginResult.requiresRegistration) {
        toast.info('Usuario no encontrado. Creando cuenta automáticamente...');
        return await googleSignup(idToken);
      }

      return loginResult;
    } else {
      return await googleSignup(idToken);
    }
  };

  /**
   * Actualiza información de empresa (Fase 4) para usuarios de Google
   */
  const updateCompanyInfo = async (
    userId: string,
    session: string,
    companyData: any
  ): Promise<any> => {
    setIsLoading(true);

    try {
      const { data } = await fetcher('post', {
        body: {
          model: 'users/new',
          phase: '4',
          user_id: userId,
          session: session,
          ...companyData,
        },
        requireSession: false,
      });

      if (apiErrorValidation(data)) {
        throw new Error((data as any)?.info || 'Error al actualizar información de empresa');
      }

      return { success: true, company: (data as any).company };
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar empresa');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getAccessTokenForContacts = async (idToken: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('🔄 Solicitando access token para contactos...');
      
      // Intentar obtener access token usando Google Identity Services
      if (window.google && window.google.accounts) {
        console.log('🔄 Iniciando solicitud de access token...');
        
        window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/contacts.readonly',
          callback: (response: any) => {
            if (response.access_token) {
              console.log('✅ Access token obtenido para contactos: SÍ (' + response.access_token.length + ' chars)');
              resolve(response.access_token);
            } else {
              console.error('❌ No se obtuvo access token en la respuesta');
              reject(new Error('No access token in response'));
            }
          },
          error_callback: (error: any) => {
            console.error('❌ Error en access token callback:', error);
            
            // Si el error es de popup bloqueado, intentar método alternativo
            if (error.type === 'popup_failed_to_open' || error.message.includes('popup')) {
              console.log('🔄 Popup bloqueado, intentando método alternativo...');
              
              // Intentar obtener access token usando el ID token como fallback
              console.log('🔄 Usando ID token como access token temporal para testing');
              resolve(idToken);
              return;
            }
            
            reject(new Error('Error al obtener access token: ' + error.message));
          }
        }).requestAccessToken();
      } else {
        console.error('❌ Google Identity Services no disponible');
        reject(new Error('Google Identity Services not available'));
      }
    });
  };

  return {
    googleLogin,
    googleSignup,
    handleGoogleAuth,
    updateCompanyInfo,
    isLoading,
  };
};
