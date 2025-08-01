/**
 * Formulario de Login/Inicio de Sesión
 *
 * Este componente maneja el proceso de autenticación de usuarios:
 * - Login básico: email + password
 * - Soporte MFA: código de verificación adicional
 * - Redirección automática según rol de usuario
 *
 * Integración con backend:
 * - POST /api?model=users/access (autenticación)
 * - Soporte para Google OAuth (pendiente integración)
 *
 * Estados de login:
 * - Normal: email + password
 * - MFA: requiere código adicional
 * - Error: credenciales inválidas
 *
 * @author Codefend Team
 * @version 2.0 (Preparado para Google OAuth)
 */

import { ModalWrapper } from '@modals/index';
import css from './signinform.module.scss';
import { useLoginAction } from '@userHooks/auth/useLoginAction';
import { Link, useLocation, useNavigate } from 'react-router';
import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';
import { sendEventToGTM } from '@utils/gtm';
import { GoogleAuthButton } from '@/app/views/components/GoogleAuthButton/GoogleAuthButton';
import { useGoogleAuth } from '@/app/data/hooks/users/auth/useGoogleAuth';
import { usePageTracking } from '@/app/data/hooks/tracking/usePageTracking';
import '@/app/views/components/GoogleAuthButton/GoogleAuthButton.scss';
import { toast } from 'react-toastify';
import { useTheme } from '@/app/views/context/ThemeContext';

const EyeIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const NewSigninForm = () => {
  const { signInUser, isLoading } = useLoginAction();
  const { handleGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth();
  const { trackSigninVisit } = usePageTracking();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const { theme } = useTheme();

  // Tracking de página visitada para el gráfico de administración (no-bloqueante)
  useEffect(() => {
    trackSigninVisit().catch(error => {
      console.warn('⚠️ Tracking signin falló (no crítico):', error);
    });
  }, [trackSigninVisit]);

  const handleGoogleSuccess = async (credential: string) => {
    try {
      // Evento de telemetría: inicio de autenticación con Google
      sendEventToGTM({
        event: 'inicio_sesion_google_iniciado',
        category: 'autenticacion',
        action: 'google_oauth',
        label: 'inicio_proceso',
      });

      const result = await handleGoogleAuth(credential, 'signin');

      if (result.success) {
        // Evento de telemetría: login exitoso con Google
        sendEventToGTM({
          event: 'inicio_sesion_google_exitoso',
          category: 'autenticacion',
          action: 'google_oauth',
          label: 'login_exitoso',
        });

        const state = location.state;
        // Small delay to ensure state persistence before navigation
        setTimeout(() => {
          if (state && state?.redirect) {
            navigate(state.redirect || '/');
          } else {
            navigate('/');
          }
        }, 150); // 150ms delay to ensure localStorage persistence
      }
    } catch (error: any) {
      // Evento de telemetría: error en login con Google
      sendEventToGTM({
        event: 'inicio_sesion_google_error',
        category: 'autenticacion',
        action: 'google_oauth',
        label: 'login_error',
      });
    }
  };

  const handleGoogleError = (error: string) => {
    console.error('Google Auth Error:', error);
    // Evento de telemetría: error en autenticación con Google
    sendEventToGTM({
      event: 'inicio_sesion_google_error',
      category: 'autenticacion',
      action: 'google_oauth',
      label: 'auth_error',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get('email') as unknown as string;
    const password = form.get('password') as unknown as string;
    const mfa = form.get('mfa') as unknown as string;
    signInUser(email || '', password || '', mfa || '').then((result: any) => {
      if (result?.mfaRequired) {
        // Evento de telemetría: el usuario requiere MFA para iniciar sesión
        sendEventToGTM({
          event: 'inicio_sesion_mfa_requerido',
          category: 'autenticacion', // Traducido de: 'auth'
          action: 'iniciar_sesion', // Traducido de: 'signin'
          label: 'mfa_requerido', // Traducido de: 'signin_mfa_required'
        });
        setMfaStep(true);
        return;
      }
      if (result?.error === 'invalid_username_or_password') {
        // Evento de telemetría: error de credenciales inválidas al iniciar sesión
        sendEventToGTM({
          event: 'inicio_sesion_error',
          category: 'autenticacion', // Traducido de: 'auth'
          action: 'iniciar_sesion', // Traducido de: 'signin'
          label: 'credenciales_invalidas', // Traducido de: 'invalid_username_or_password'
        });
        return;
      }
      const state = location.state;
      if (result && !result.error) {
        // Evento de telemetría: inicio de sesión exitoso/valido
        sendEventToGTM({
          event: 'inicio_sesion_valido',
          category: 'autenticacion', // Traducido de: 'auth'
          action: 'iniciar_sesion', // Traducido de: 'signin'
          label: 'inicio_exitoso', // Traducido de: 'signin_success'
        });

        // Small delay to ensure state persistence before navigation
        setTimeout(() => {
          if (state && state?.redirect) {
            navigate(state.redirect || '/');
          } else {
            navigate('/');
          }
        }, 150); // 150ms delay to ensure localStorage persistence
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={`${css['signinform']} new-signin-form`}>
      <div className={`${css['signinContent']} new-auth-content form-content`}>
        <img src={`/codefend/brand-small-${theme}.png`} width={220} />
        {/* <ChangeAuthPages pathname={location.pathname} /> */}

        <p>
          {mfaStep
            ? 'This account has two-factor authentication enabled, please complete the verification process.'
            : 'Welcome back'}
        </p>

        {/* Botón de Google OAuth - Solo mostrar si no está en paso MFA */}
        {!mfaStep && (
          <>
            <hr className="onboarding-separator" />

            <GoogleAuthButton
              text="Access with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={isLoading || isGoogleLoading}
              mode="signin"
            />

            <hr className="onboarding-separator" />
          </>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInput
            className={mfaStep ? css['hide-for-mfa'] : ''}
            placeholder="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <div className={css['password-input-wrapper']}>
            <AuthInput
              className={`${mfaStep ? css['hide-for-mfa'] : ''} ${css['password-input']}`}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="off"
              required
            />
            <button
              type="button"
              className={css['toggle-password']}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {mfaStep && (
            <AuthInput
              placeholder="MFA Code"
              type="text"
              name="mfa"
              autoComplete="one-time-code"
              required
            />
          )}
          <button type="submit" className={`btn btn-red ${css['sendButton']}`} disabled={isLoading}>
            continue
          </button>
        </form>
        {!mfaStep && (
          <Link
            to="/auth/recovery"
            className="password-recovery"
            style={{
              color: '#00000080',
              fontSize: '0.9rem',
              margin: '25px auto 0px auto',
              textDecoration: 'underline',
            }}>
            I don't remember my password
          </Link>
        )}
        <Link to="/auth/signup" className="auth-link">
          Don't have an account? Sign up
        </Link>
      </div>
    </ModalWrapper>
  );
};
