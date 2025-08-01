/**
 * Formulario de Registro Multi-Paso (3 Fases) - UNIFICADO
 *
 * Este componente maneja el proceso completo de registro de usuario:
 * - STEP_ONE: Información personal (nombre, apellido, email)
 * - STEP_TWO: Verificación de email (código de confirmación)
 * - STEP_THREE: Configuración de contraseña y username
 *
 * NOTA: Los datos de empresa se capturan en el onboarding post-registro
 *
 * Integración con backend:
 * - Fase 1: POST /api?model=users/new&phase=1 (crear lead sin datos empresa)
 * - Fase 2: POST /api?model=users/new&phase=2 (obtener username recomendado)
 * - Fase 3: signUpFinish() (crear usuario final)
 * - Post-login: Redirección a onboarding para capturar datos de empresa
 *
 * @author Codefend Team
 * @version 3.0 (Flujo Unificado + Google OAuth)
 */

import { ModalWrapper } from '@modals/index';
import { useEffect, useState, type FormEvent } from 'react';
import css from './signinform.module.scss';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation, isEquals, passwordValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { toast } from '@/app/data/utils';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';
import Show from '@/app/views/components/Show/Show';
import { PageOrbitLoader } from '@/app/views/components/loaders/Loader';
import { ProgressBar } from '@/app/views/components/ProgressBar/ProgressBar';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';
import CheckEmail from '@/app/views/components/CheckEmail/CheckEmail';
import { sendEventToGTM } from '@utils/gtm';
import { GoogleAuthButton } from '@/app/views/components/GoogleAuthButton/GoogleAuthButton';
import { useGoogleAuth } from '@/app/data/hooks/users/auth/useGoogleAuth';
import { usePageTracking } from '@/app/data/hooks/tracking/usePageTracking';
import { SignUpSteps } from '@/app/constants/newSignupText';
import { useTheme } from '@/app/views/context/ThemeContext';

export const STEPSDATA: Record<SignUpSteps, any> = {
  [SignUpSteps.STEP_ONE]: {
    p: (
      <>
        Create an account and <b>unvail leaks, live vulnerabilities, servers, domains</b> and hidden
        assets and risks in your business.
      </>
    ),
    label: 'Create an account and unvail threats',
  },
  [SignUpSteps.STEP_TWO]: {
    p: 'We sent you an email with an activation code, please paste it below or click the link on the email.',
    label: 'An activation code has been sent.',
  },
  [SignUpSteps.STEP_THREE]: {
    p: 'Define your password in the form below. There’s an option to make and random password and save to clipboard.',
    label: 'Almost done... we need to set a password',
  },
  [SignUpSteps.STEP_FOUR]: {
    p: 'Done! We’ve reached the final step—now you just need to set your password to access the system and start your free trial. Your password must contain 1 number, 1 letter, 12 characters, and a symbol.',
    label: 'Add your password',
  },
};

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

export const NewSignupForm = () => {
  const [activeStep, setActiveStep] = useState(SignUpSteps.STEP_ONE);
  const [fetcher, _, isLoading] = useFetcher();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [lead_reference_number, setLeadReferenceNumber] = useState('');
  const [username, setRecommendedUsername] = useState('');
  const [specialLoading, setLoading] = useState(false);
  const { signUpFinish, isLoading: loadingFinish, lead } = useRegisterPhaseTwo();
  const { handleGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth();
  const { trackSignupVisit } = usePageTracking();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { ref } = useParams();
  const { theme } = useTheme();

  useEffect(() => {
    // Evento de telemetría: inicio del proceso de registro de usuario
    sessionStorage.setItem('nuevo_usuario', Date.now().toString());
    sendEventToGTM({
      event: 'usuario_creacion_acceso',
      category: 'registro',
      action: 'inicio_proceso',
      label: 'carga_pagina',
    });

    // Tracking de página visitada para el gráfico de administración (no-bloqueante)
    trackSignupVisit().catch(error => {
      console.warn('⚠️ Tracking signup falló (no crítico):', error);
    });

    const code = searchParams.get('code') || ref;
    if (code) {
      setLoading(true);
      getRecommendedUsername(code)
        .then(() => {
          setActiveStep(SignUpSteps.STEP_THREE);
          lead.set({});
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const goBackValidateMe = (goTo: SignUpSteps) => {
    setActiveStep(goTo);
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      // Evento de telemetría: inicio de registro con Google
      sendEventToGTM({
        event: 'usuario_creacion_google_iniciado',
        category: 'registro',
        action: 'google_oauth',
        label: 'inicio_proceso',
      });

      const result = await handleGoogleAuth(credential, 'signup');

      if (result.success) {
        // Evento de telemetría: registro exitoso con Google
        sendEventToGTM({
          event: 'usuario_creacion_google_exitoso',
          category: 'registro',
          action: 'google_oauth',
          label: 'registro_exitoso',
        });

        // Verificar si necesita onboarding
        if (result.needs_onboarding) {
          // Redirigir al onboarding para capturar datos de empresa
          // console.log('🚀 Google OAuth - Usuario necesita onboarding, redirigiendo...');
          window.location.href = '/onboarding';
        } else {
          // Redirigir al dashboard si ya completó onboarding
          // console.log('✅ Google OAuth - Usuario ya completó onboarding, ir al dashboard');
          window.location.href = '/';
        }
      }
    } catch (error) {
      // Evento de telemetría: error en registro con Google
      sendEventToGTM({
        event: 'usuario_creacion_google_error',
        category: 'registro',
        action: 'google_oauth',
        label: 'registro_error',
      });
    }
  };

  const handleGoogleError = (error: string) => {
    console.error('Google Auth Error:', error);
    // Evento de telemetría: error en autenticación con Google
    sendEventToGTM({
      event: 'usuario_creacion_google_error',
      category: 'registro',
      action: 'google_oauth',
      label: 'auth_error',
    });
  };

  // Función para generar password aleatorio siguiendo el patrón especificado
  const generateRandomPassword = () => {
    // Caracteres permitidos basados en los ejemplos
    const allowedLetters = 'zbxcnmuioqerashkl';
    const allowedLettersUppercase = allowedLetters.toUpperCase(); // ZBXCNMUIOQERASHKL
    const allowedNumbers = '0123456789';
    const allowedSymbols = '!,<';

    // Combinar todos los caracteres (sin mayúsculas para el resto)
    const allCharsForMiddle = allowedLetters + allowedNumbers + allowedSymbols;

    // Generar longitud aleatoria entre 20 y 25 caracteres
    const length = Math.floor(Math.random() * 6) + 20;

    let password = '';

    for (let i = 0; i < length; i++) {
      if (i === 0) {
        // Primera letra: siempre mayúscula
        password += allowedLettersUppercase.charAt(
          Math.floor(Math.random() * allowedLettersUppercase.length)
        );
      } else {
        // Resto del password: usar cualquier carácter permitido
        password += allCharsForMiddle.charAt(Math.floor(Math.random() * allCharsForMiddle.length));
      }
    }

    return password;
  };

  // Función para generar password y copiar al clipboard
  const handleGeneratePassword = async () => {
    try {
      const generatedPassword = generateRandomPassword();

      // Establecer el password en ambos inputs
      setPassword(generatedPassword);
      setConfirmPassword(generatedPassword);

      // Hacer visible los passwords
      setShowPasswords(true);

      // Copiar al clipboard
      await navigator.clipboard.writeText(generatedPassword);

      // Evento de telemetría
      sendEventToGTM({
        event: 'usuario_creacion_password_generado',
        category: 'registro',
        action: 'generar_password',
        label: 'password_aleatorio',
      });
    } catch (error) {
      console.error('Error generating password:', error);
      toast.error('Failed to generate password. Please try again.');
    }
  };

  const nextFirstStep = (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const formObject = Object.fromEntries(form.entries());

    lead.set({
      ...lead.get,
      lead_fname: formObject?.['lead_fname'] as string,
      lead_lname: formObject?.['lead_lname'] as string,
      lead_email: formObject?.['lead_email'] as string,
    });

    localStorage.setItem('signupFormData', JSON.stringify(formObject));

    // Agregar datos requeridos por el backend
    form.append('idiom', 'en');
    form.append('reseller_id', '1');
    form.append('reseller_name', 'codefend');
    form.append('phase', '1');
    form.append('model', 'users/new');

    const formRequestObject = Object.fromEntries(form.entries());

    // Enviar datos al backend para crear lead
    fetcher('post', { body: formRequestObject, requireSession: false })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          toast.error(data?.info || 'An unexpected error has occurred');
          throw new Error('');
        }

        // Evento de telemetría: completado datos personales en registro
        const tiempoInicio = parseInt(sessionStorage.getItem('nuevo_usuario') || '0');
        sendEventToGTM({
          event: 'usuario_creacion_informacion_personal',
          category: 'registro',
          action: 'completar_paso',
          label: 'datos_personales',
          demora: Date.now() - tiempoInicio,
        });

        // Ir directamente a verificación de email (saltamos el paso de empresa)
        setActiveStep(SignUpSteps.STEP_TWO);
      })
      .catch(() => {
        // Error ya manejado por toast
      });
  };

  const getRecommendedUsername = (code: string) => {
    const body = {
      lead_reference_number: code,
      phase: '2',
      model: 'users/new',
    };
    return fetcher('post', { body, requireSession: false, requireJson: false }).then(
      ({ data }: any) => {
        if (apiErrorValidation(data)) {
          toast.error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
          throw new Error('');
        }
        setRecommendedUsername(data.recommended_username);
        setLeadReferenceNumber(String(code) || '');
      }
    );
  };

  const nextThreeStep = (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const referenceNumber = form.get?.('lead_reference_number') as unknown as string;
    getRecommendedUsername(referenceNumber).then(() => {
      // Evento de telemetría: completado número de referencia en registro
      const tiempoInicio = parseInt(sessionStorage.getItem('nuevo_usuario') || '0');
      sendEventToGTM({
        event: 'usuario_creacion_informacion_reference_number',
        category: 'registro',
        action: 'completar_paso',
        label: 'numero_referencia',
        demora: Date.now() - tiempoInicio,
      });

      setActiveStep(SignUpSteps.STEP_THREE);
      lead.set({});
    });
  };

  const nextFourStep = (e: FormEvent) => {
    e.preventDefault();
    if (!passwordValidation(password)) {
      toast.error(AUTH_TEXT.INVALID_PASSWORD);
      return;
    }
    if (!isEquals(password, confirmPassword)) {
      toast.error(AUTH_TEXT.PASSWORD_NOT_MATCH);
      return;
    }
    const form = new FormData();
    form.append('password', password);
    form.append('lead_reference_number', lead_reference_number);
    form.append('username', username);
    const formObject = Object.fromEntries(form.entries());
    signUpFinish(formObject).then((res: any) => {
      if (res.pass) {
        // Evento de telemetría: completado contraseña en registro
        const tiempoInicio = parseInt(sessionStorage.getItem('nuevo_usuario') || '0');
        sendEventToGTM({
          event: 'usuario_creacion_informacion_password',
          category: 'registro',
          action: 'completar_paso',
          label: 'contraseña',
          demora: Date.now() - tiempoInicio,
        });

        // Evento de telemetría: finalización completa del proceso de registro
        sendEventToGTM({
          event: 'usuario_creacion_finalizacion',
          category: 'registro',
          action: 'finalizar_proceso',
          label: 'registro_completo',
          demora_total: Date.now() - tiempoInicio,
        });

        // Verificar si necesita onboarding
        if (res.needs_onboarding) {
          // Redirigir al onboarding para capturar datos de empresa
          // console.log('🚀 Usuario necesita onboarding, redirigiendo...');
          window.location.href = '/onboarding';
        } else {
          // Redirigir al dashboard si ya completó onboarding
          // console.log('✅ Usuario ya completó onboarding, ir al dashboard');
          window.location.href = '/';
        }
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={`${css['signinform']} new-signup-form`}>
      <div className="new-auth-content readonly-content">
        <h1>
          Unveil the full attack surface...
          <br />
          <span>discover real threats</span>
        </h1>

        <p className="header-text">
          Start with a one domain or email. Codefend uncovers what’s leaking, exposed or exploitable
          — before attackers do. Browse and scan across thousands of systems and millions of
          breached identities indexed. We are experts in blackbox operations.
        </p>

        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">
              <img src="/codefend/Grupo-1.png" alt="Professional hackers" />
            </div>
            <div className="feature-content">
              <h3>Professional hackers on demand</h3>
              <p>
                Hire professional hackers on demand, when you need them! Our professionals follow
                the same paths real attackers do.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src="/codefend/icono-leaks.png" alt="Database explorer" />
            </div>
            <div className="feature-content">
              <h3>Full dataleaks explorer</h3>
              <p>
                See what parts of your tech stack have already been leaked. Correlate your users
                with 190B+ breached records and discover hidden threats.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src="/codefend/icono-bicho.png" alt="Attack surface map" />
            </div>
            <div className="feature-content">
              <h3>Automated attack surface map</h3>
              <p>
                Visualize the online exposure like never before. From one domain to your full
                infrastructure — unveil hosts, techs, live vulnerabilities and people and more.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={`${css['signupContent']} new-auth-content form-content`}>
        <img src={`/codefend/brand-small-${theme}.png`} width={220} />
        <ProgressBar activeStep={activeStep} />
        <h2>{STEPSDATA[activeStep]?.label}</h2>
        <p className="step-text-header">{STEPSDATA[activeStep].p}</p>
        <Show when={activeStep === SignUpSteps.STEP_ONE && !specialLoading}>
          <hr className="onboarding-separator" />
          <GoogleAuthButton
            text="Registrarse con Google"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading || isGoogleLoading}
            mode="signup"
          />
          <hr className="onboarding-separator" />

          <form onSubmit={nextFirstStep}>
            {/* <div className={css['headerText']}>{<p>{STEPSDATA[activeStep]?.label}</p>}</div> */}
            <h2>Private account creation</h2>
            {/* <ProgressBar activeStep={activeStep} /> */}
            <AuthInput
              placeholder="Name"
              name="lead_fname"
              autoComplete="given-name"
              defaultValue={lead.get.lead_fname}
              required
            />
            <AuthInput
              placeholder="Last name"
              name="lead_lname"
              autoComplete="family-name"
              defaultValue={lead.get.lead_lname}
              required
            />
            <AuthInput
              type="email"
              name="lead_email"
              autoComplete="email"
              placeholder="Email"
              defaultValue={lead.get.lead_email}
              required
            />

            <button type="submit" className={`btn btn-red  ${css['sendButton']}`}>
              Continue
            </button>
          </form>
          <Link to="/auth/signin" className="auth-link">
            Already have an account? Login
          </Link>
        </Show>

        <Show when={activeStep === SignUpSteps.STEP_TWO && !specialLoading}>
          <form onSubmit={nextThreeStep}>
            <CheckEmail />
            <AuthInput placeholder="Insert Unique code" name="lead_reference_number" required />
            <div className={`form-buttons ${css['form-btns']}`}>
              <button
                type="button"
                className={`btn btn-gray`}
                onClick={() => goBackValidateMe(SignUpSteps.STEP_ONE)}>
                back
              </button>
              <button
                type="submit"
                className={`btn btn-red ${css['sendButton']}`}
                disabled={isLoading}>
                continue
              </button>
            </div>
          </form>
        </Show>

        {/* Tercer paso del formulario - CONFIGURACIÓN DE CONTRASEÑA */}
        <Show when={activeStep === SignUpSteps.STEP_THREE && !specialLoading}>
          <form onSubmit={nextFourStep}>
            <CheckEmail imgSrc="/codefend/password1.png" />
            <div className={css['password-input-wrapper']}>
              <AuthInput
                type={showPasswords ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                value={password}
                setVal={e => setPassword(e.target.value)}
                autoComplete="off"
                required
              />
              <button
                type="button"
                className={css['toggle-password']}
                onClick={() => setShowPasswords(!showPasswords)}
                tabIndex={-1}
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}>
                {showPasswords ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className={css['password-input-wrapper']}>
              <AuthInput
                type={showPasswords ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                setVal={e => setConfirmPassword(e.target.value)}
                autoComplete="off"
                required
              />
              <button
                type="button"
                className={css['toggle-password']}
                onClick={() => setShowPasswords(!showPasswords)}
                tabIndex={-1}
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}>
                {showPasswords ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <PasswordRequirements password={password} />

            <div className={`form-buttons ${css['form-btns']}`}>
              <button type="button" className={`btn btn-black`} onClick={handleGeneratePassword}>
                Use a random pass
              </button>
              <button
                type="submit"
                className={`btn btn-red ${css['sendButton']}`}
                disabled={loadingFinish}>
                continue
              </button>
            </div>
          </form>
        </Show>

        {/* Loader */}
        <Show when={specialLoading && !!searchParams.get('code')}>
          <div>
            <PageOrbitLoader />
          </div>
        </Show>
      </div>
    </ModalWrapper>
  );
};
