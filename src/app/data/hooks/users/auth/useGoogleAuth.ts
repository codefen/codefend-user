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

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useSessionManager } from './useSessionManager';

export const useGoogleAuth = () => {
  const [fetcher] = useFetcher();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSuccessfulLogin } = useSessionManager();

  /**
   * Intenta hacer login con Google para usuarios existentes
   */
  const googleLogin = async (idToken: string): Promise<any> => {
    setIsLoading(true);
    
    try {
      const { data } = await fetcher('post', {
        body: { id_token: idToken },
        path: '/users/google/login',
        requireSession: false,
      });

      if (apiErrorValidation(data)) {
        // Si el error es que el usuario no existe, devolver info para registro
        if (data.error_info === 'user_not_found') {
          return { 
            requiresRegistration: true, 
            googleData: data.google_data,
            message: 'Usuario no encontrado. Se requiere registro.'
          };
        }
        
        throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
      }

      // Login exitoso
      const user = handleSuccessfulLogin(data);
      return { success: true, user };

    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario con Google OAuth
   */
  const googleSignup = async (idToken: string, additionalData?: any): Promise<any> => {
    setIsLoading(true);
    
    try {
      // Primer paso: crear lead con datos de Google
      const signupData = {
        phase: '1',
        auth_provider: 'google',
        id_token: idToken,
        personal_user: '1', // Usuario personal por defecto
        reseller_id: '1',
        reseller_name: 'codefend',
        idiom: 'en',
        ...additionalData
      };

      const { data: leadData } = await fetcher('post', {
        body: signupData,
        path: '/users/new',
        requireSession: false,
      });

      if (apiErrorValidation(leadData)) {
        throw new Error(leadData?.info || 'Error al crear cuenta con Google');
      }

      // El backend ya maneja automáticamente las fases 2 y 3 para Google OAuth
      // Devolver datos del lead para posible fase 4 (actualización de empresa)
      return { 
        success: true, 
        lead: leadData.leads,
        message: 'Cuenta creada exitosamente con Google'
      };

    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse con Google');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la respuesta de Google OAuth (login o registro)
   */
  const handleGoogleAuth = async (idToken: string, mode: 'signin' | 'signup' = 'signin'): Promise<any> => {
    if (mode === 'signin') {
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
  const updateCompanyInfo = async (userId: string, session: string, companyData: any): Promise<any> => {
    setIsLoading(true);
    
    try {
      const { data } = await fetcher('post', {
        body: {
          phase: '4',
          user_id: userId,
          session: session,
          ...companyData
        },
        path: '/users/new',
        requireSession: false,
      });

      if (apiErrorValidation(data)) {
        throw new Error(data?.info || 'Error al actualizar información de empresa');
      }

      return { success: true, company: data.company };

    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar empresa');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    googleLogin,
    googleSignup,
    handleGoogleAuth,
    updateCompanyInfo,
    isLoading
  };
}; 