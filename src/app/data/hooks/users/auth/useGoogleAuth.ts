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

export const useGoogleAuth = () => {
  const [fetcher] = useFetcher();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSuccessfulLogin } = useSessionManager();
  const { update: updateInitialDomain } = useInitialDomainStore();

  /**
   * Intenta hacer login con Google para usuarios existentes
   */
  const googleLogin = async (idToken: string): Promise<any> => {
    setIsLoading(true);
    
    try {
      const { data } = await fetcher('post', {
        body: { 
          id_token: idToken,
          model: 'users/google/login'
        },
        requireSession: false,
      });

      if (apiErrorValidation(data)) {
        // Si hay error de validación, podría ser usuario no registrado
        throw new Error((data as any)?.info || 'Error al iniciar sesión con Google');
      }

      // Login exitoso
      // Para usuarios de Google OAuth (que suelen ser personales), limpiar el store
      updateInitialDomain('initialDomain', '');
      updateInitialDomain('scopeType', 'email');
      console.log('🧹 Google Login - Store limpiado y configurado para email');
      
      const user = handleSuccessfulLogin(data);
        return { 
          success: true, 
        user,
        message: 'Sesión iniciada exitosamente con Google'
      };

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
        model: 'users/new',
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
        requireSession: false,
      });

      if (apiErrorValidation(leadData)) {
        throw new Error((leadData as any)?.info || 'Error al crear cuenta con Google');
      }

      // El backend ya maneja automáticamente las fases 2 y 3 para Google OAuth
      // Si hay sesión, significa que se creó el usuario automáticamente
      if ((leadData as any)?.session) {
        // Verificar si necesita onboarding ANTES de hacer login
        if ((leadData as any)?.needs_onboarding) {
          // Guardar datos temporales para el onboarding
          localStorage.setItem('onboarding_data', JSON.stringify(leadData));
          localStorage.setItem('temp_session_data', JSON.stringify({ session: (leadData as any).session }));
          
          console.log('🚀 Google OAuth - Datos temporales guardados para onboarding');
          
          return { 
            success: true, 
            user: (leadData as any).user,
            needs_onboarding: true,
            data: leadData,
            message: 'Cuenta creada exitosamente con Google. Completa tu perfil.'
          };
        } else {
          // Si no necesita onboarding, proceder con login normal
          // Para usuarios de Google OAuth (que son personales por defecto), limpiar el store
          updateInitialDomain('initialDomain', '');
          updateInitialDomain('scopeType', 'email');
          console.log('🧹 Google OAuth - Usuario personal, store limpiado y configurado para email');
          
          const user = handleSuccessfulLogin(leadData);
          return { 
            success: true, 
            user,
            message: 'Cuenta creada e iniciada sesión exitosamente con Google'
          };
        }
      }

      // Si no hay sesión, devolver datos del lead para posible fase 4
      return { 
        success: true, 
        lead: (leadData as any).leads,
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
          model: 'users/new',
          phase: '4',
          user_id: userId,
          session: session,
          ...companyData
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

  return {
    googleLogin,
    googleSignup,
    handleGoogleAuth,
    updateCompanyInfo,
    isLoading
  };
}; 