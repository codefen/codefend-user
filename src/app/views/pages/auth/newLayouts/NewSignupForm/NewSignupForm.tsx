import { ModalWrapper } from '@modals/index';
import { useEffect, useState, type FormEvent } from 'react';
import css from './signinform.module.scss';
import { companySizesList } from '@mocks/defaultData';
import { useFetcher } from '#commonHooks/useFetcher';
import { defaultCountries } from '@/app/constants/countries';
import { apiErrorValidation, isEquals, passwordValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { toast } from 'react-toastify';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import { useLocation, useParams, useSearchParams } from 'react-router';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { idiomOptions, SignUpSteps, STEPSDATA } from '@/app/constants/newSignupText';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';
import PhoneInput from '@/app/views/components/PhoneInput/PhoneInput';
import Show from '@/app/views/components/Show/Show';
import { PageOrbitLoader } from '@/app/views/components/loaders/Loader';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import { ProgressBar } from '@/app/views/components/ProgressBar/ProgressBar';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';
import SelectField from '@/app/views/components/SelectField/SelectField';
import CheckEmail from '@/app/views/components/CheckEmail/CheckEmail';
import { sendEventToGTM } from '@utils/gtm';

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
  const { signUpFinish, isLoading: loadingFinish, lead, country } = useRegisterPhaseTwo();
  const [searchParams] = useSearchParams();
  const { saveInitialDomain } = useWelcomeStore();
  const location = useLocation();
  const { ref } = useParams();
  const { update } = useInitialDomainStore();

  useEffect(() => {
    // Evento GTM: Inicio del proceso de creación de usuario
    sessionStorage.setItem("nuevo_usuario", Date.now().toString());
    sendEventToGTM({
      event: "usuario_creacion_acceso",
      category: "registro",
      action: "inicio_proceso",
      label: "carga_pagina",
    });

    const code = searchParams.get('code') || ref;
    if (code) {
      setLoading(true);
      getRecommendedUsername(code)
        .then(() => {
          setActiveStep(SignUpSteps.STEP_FOUR);
          lead.set({});
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const goBackValidateMe = (goTo: SignUpSteps) => {
    setActiveStep(goTo);
  };
  const nextFirstStep = (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const formObject = Object.fromEntries(form.entries()); // Se extraen los datos del formulario
    // Se extrae el numero de telefono de forma correcta, debido a que el input esta en dos partes
    // const fullNumberRaw = formObject?.['lead_phone'] as string;
    // const [areaCode, number] = fullNumberRaw.split(/\*+/);
    lead.set({
      ...lead.get,
      lead_fname: formObject?.['lead_fname'] as string,
      lead_lname: formObject?.['lead_lname'] as string,
      lead_email: formObject?.['lead_email'] as string,
      // lead_phone: number,
    });
    // formObject['lead_phone'] = `${areaCode}${number}`;
    localStorage.setItem('signupFormData', JSON.stringify(formObject));
    
    // Evento GTM: Completado datos personales
    const tiempoInicio = parseInt(sessionStorage.getItem("nuevo_usuario") || "0");
    sendEventToGTM({
      event: "usuario_creacion_informacion_personal",
      category: "registro",
      action: "completar_paso",
      label: "datos_personales",
      demora: Date.now() - tiempoInicio,
    });
    
    // Nuevo paso
    setActiveStep(SignUpSteps.STEP_TWO);
  };

  const nextSecondStep = (e: FormEvent) => {
    e.preventDefault();
    const data = localStorage.getItem('signupFormData');
    const form = new FormData(e.currentTarget as HTMLFormElement);
    if (data) {
      Object.entries(JSON.parse(data)).map(([key, val]) => form.append(key, String(val)));
    }
    saveInitialDomain((form.get('company_web') as string) || '');
    form.append('idiom', 'en');
    lead.set({
      ...lead.get,
      company_name: form?.get('company_name') as string,
      company_web: form?.get('company_web') as string,
      company_size: form?.get('company_size') as string,
      idiom: form?.get('idiom') as string,
    });
    form.append(
      'company_area',
      defaultCountries?.filter(i => i?.alpha2Code === country?.get)?.[0]?.name
    );

    form.append('reseller_id', '1');
    form.append('reseller_name', 'codefend');

    // Endpoint reference
    form.append('phase', '1');
    form.append('model', 'users/new');
    const formObject = Object.fromEntries(form.entries());
    fetcher('post', { body: formObject, requireSession: false }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        toast.error(data?.info || 'An unexpected error has occurred');
        throw new Error('');
      }
      
      // Evento GTM: Completado datos de empresa
      const tiempoInicio = parseInt(sessionStorage.getItem("nuevo_usuario") || "0");
      sendEventToGTM({
        event: "usuario_creacion_informacion_empresa",
        category: "registro",
        action: "completar_paso",
        label: "datos_empresa",
        demora: Date.now() - tiempoInicio,
      });
      
      setActiveStep(SignUpSteps.STEP_THREE);
      update('initialDomain', form?.get('company_web') as string);
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
      // Evento GTM: Completado número de referencia
      const tiempoInicio = parseInt(sessionStorage.getItem("nuevo_usuario") || "0");
      sendEventToGTM({
        event: "usuario_creacion_informacion_reference_number",
        category: "registro",
        action: "completar_paso",
        label: "numero_referencia",
        demora: Date.now() - tiempoInicio,
      });
      
      setActiveStep(SignUpSteps.STEP_FOUR);
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
        // Evento GTM: Completado contraseña
        const tiempoInicio = parseInt(sessionStorage.getItem("nuevo_usuario") || "0");
        sendEventToGTM({
          event: "usuario_creacion_informacion_password",
          category: "registro",
          action: "completar_paso",
          label: "contraseña",
          demora: Date.now() - tiempoInicio,
        });
        
        // Evento GTM: Finalización completa del proceso
        sendEventToGTM({
          event: "usuario_creacion_finalizacion",
          category: "registro",
          action: "finalizar_proceso",
          label: "registro_completo",
          demora_total: Date.now() - tiempoInicio,
        });
        
        //if (user?.accessRole == 'user') navigate('/');
        //if (user?.accessRole == 'admin') navigate('/admin');
        //if (user?.accessRole == 'provider') navigate('/provider/profile');
        //navigate('/');
        window.location.href = '/';
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['signinform']}>
      <div className={css['signupContent']}>
        <img src="/codefend/logo-color.png" width={220} />
        <ChangeAuthPages pathname={location.pathname} />

        <p style={{ marginBottom: '25px' }}>{STEPSDATA[activeStep].p}</p>

        {/* Primer paso del formulario */}
        <Show when={activeStep === SignUpSteps.STEP_ONE && !specialLoading}>
          <form onSubmit={nextFirstStep}>
            {/* <div className={css['headerText']}>{<p>{STEPSDATA[activeStep]?.label}</p>}</div> */}
            <ProgressBar activeStep={activeStep} />
            <AuthInput
              placeholder="First name"
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
            {/* <div style={{ display: 'none' }}>
              <PhoneInput
                name="lead_phone"
                defaultPhone={lead.get.lead_phone}
                defaultCountry={country.get}
                changeCountryCode={countryFull => country.set(countryFull.alpha2Code)}
              />
            </div> */}
            <button type="submit" className={`btn ${css['sendButton']}`}>
              continue
            </button>
          </form>
        </Show>

        {/* Segundo paso del formulario */}
        <Show when={activeStep === SignUpSteps.STEP_TWO && !specialLoading}>
          <form onSubmit={nextSecondStep}>
            <ProgressBar activeStep={activeStep} />
            <AuthInput
              placeholder="Business website"
              name="company_web"
              defaultValue={lead.get.company_web}
              setVal={e => {
                const domain = e.target.value.toLowerCase();
                const companyNameInput = document.querySelector(
                  'input[name="company_name"]'
                ) as HTMLInputElement;
                if (companyNameInput && domain) {
                  // Extraer el nombre de la compañía del dominio
                  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
                  const companyName = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
                  companyNameInput.value = companyName;
                }
              }}
              required
            />
            <AuthInput
              placeholder="Business name"
              name="company_name"
              defaultValue={lead.get.company_name}
              required
            />
            <SelectField
              name="company_size"
              options={[
                { value: '', label: 'Select Company Size', hidden: true },
                ...companySizesList.map(company => ({
                  value: company.value,
                  label: company.label,
                })),
              ]}
              defaultValue={lead.get.company_size}
              required
            />
            {/* <div style={{ display: 'none' }}>
              <SelectField
                name="idiom"
                options={idiomOptions}
                defaultValue={lead.get.idiom || 'en'}
                required
              />
            </div> */}
            <div className={`form-buttons ${css['form-btns']}`}>
              <button
                type="button"
                className={`btn btn-gray`}
                onClick={() => goBackValidateMe(SignUpSteps.STEP_ONE)}>
                back
              </button>
              <button type="submit" className={`btn ${css['sendButton']}`} disabled={isLoading}>
                validate me!
              </button>
            </div>
          </form>
        </Show>

        {/* Tercer paso del formulario */}
        <Show when={activeStep === SignUpSteps.STEP_THREE && !specialLoading}>
          <form onSubmit={nextThreeStep}>
            <ProgressBar activeStep={activeStep} />
            <CheckEmail
              text=""
              subText={`Please check your inbox, we've sent a verification code to <b>${lead.get?.lead_email}</b>, copy the verification code and paste it into the field below to confirm your email.`}
            />
            <AuthInput placeholder="Insert Unique code" name="lead_reference_number" required />
            <div className={`form-buttons ${css['form-btns']}`}>
              <button
                type="button"
                className={`btn btn-gray`}
                onClick={() => goBackValidateMe(SignUpSteps.STEP_TWO)}>
                back
              </button>
              <button type="submit" className={`btn ${css['sendButton']}`} disabled={isLoading}>
                send code
              </button>
            </div>
          </form>
        </Show>

        {/* Cuarto paso del formulario */}
        <Show when={activeStep === SignUpSteps.STEP_FOUR && !specialLoading}>
          <form onSubmit={nextFourStep}>
            <ProgressBar activeStep={activeStep} />
            <div className={css['password-input-wrapper']}>
              <AuthInput
                type={showPasswords ? 'text' : 'password'}
                placeholder="Password"
                name="password"
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
              <button
                type="button"
                className={`btn btn-gray`}
                onClick={() => goBackValidateMe(SignUpSteps.STEP_THREE)}>
                go back
              </button>
              <button type="submit" className={`btn ${css['sendButton']}`} disabled={loadingFinish}>
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
