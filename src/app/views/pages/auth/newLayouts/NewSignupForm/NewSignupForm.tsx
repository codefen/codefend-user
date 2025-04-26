import { ModalWrapper } from '@modals/index';
import { useEffect, useState, type FormEvent } from 'react';
import css from './signinform.module.scss';
import { companySizesList } from '@mocks/defaultData';
import { useFetcher } from '#commonHooks/useFetcher';
import { defaultCountries } from '@/app/constants/countries';
import { apiErrorValidation, isEquals, passwordValidation } from '@/app/constants/validations';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { toast } from 'react-toastify';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import { useLocation, useParams, useSearchParams } from 'react-router';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { SignUpSteps, STEPSDATA } from '@/app/constants/newSignupText';
import { ProgressBar } from '../../../../components/ProgressBar/ProgressBar';
import { AuthInput } from '../../newRegister/AuthInput/AuthInput';
import SelectField from '../../../../components/SelectField/SelectField';
import CheckEmail from '../../../../components/CheckEmail/CheckEmail';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';
import PhoneInput from '@/app/views/components/PhoneInput/PhoneInput';
import Show from '@/app/views/components/Show/Show';
import { PageOrbitLoader } from '@/app/views/components/loaders/Loader';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const NewSignupForm = () => {
  const [activeStep, setActiveStep] = useState(SignUpSteps.STEP_ONE);
  const [fetcher, _, isLoading] = useFetcher();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lead_reference_number, setLeadReferenceNumber] = useState('');
  const [username, setRecommendedUsername] = useState('');
  const [specialLoading, setLoading] = useState(false);
  const { signUpFinish, isLoading: loadingFinish } = useRegisterPhaseTwo();
  const [searchParams] = useSearchParams();
  const { saveInitialDomain } = useWelcomeStore();
  const location = useLocation();
  const country = useGlobalFastField('country');
  const lead = useGlobalFastField('lead');
  const { ref } = useParams();

  useEffect(() => {
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
    const fullNumberRaw = formObject?.['lead_phone'] as string;
    const [areaCode, number] = fullNumberRaw.split(/\*+/);
    lead.set({
      ...lead.get,
      lead_fname: formObject?.['lead_fname'] as string,
      lead_lname: formObject?.['lead_lname'] as string,
      lead_email: formObject?.['lead_email'] as string,
      lead_phone: number,
    });
    formObject['lead_phone'] = `${areaCode}${number}`;
    localStorage.setItem('signupFormData', JSON.stringify(formObject));
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
      if (apiErrorValidation(data?.error, data?.response)) {
        toast.error(data?.info || 'An unexpected error has occurred');
        throw new Error('');
      }
      setActiveStep(SignUpSteps.STEP_THREE);
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
        if (apiErrorValidation(data?.error, data?.response)) throw new Error('');
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
            <PhoneInput
              name="lead_phone"
              defaultPhone={lead.get.lead_phone}
              defaultCountry={country.get}
              changeCountryCode={countryFull => country.set(countryFull.alpha2Code)}
            />
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
              placeholder="Company Name"
              name="company_name"
              defaultValue={lead.get.company_name}
              required
            />
            <AuthInput
              placeholder="Company website (Ej. myweb.com)"
              name="company_web"
              defaultValue={lead.get.company_web}
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
            <SelectField
              name="idiom"
              options={[
                { value: '', label: 'Idiom', hidden: true },
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'ar', label: 'العربية' },
              ]}
              defaultValue={lead.get.idiom}
              required
            />
            <div className={`form-buttons ${css['form-btns']}`}>
              <button
                type="button"
                className={`btn btn-gray`}
                onClick={() => goBackValidateMe(SignUpSteps.STEP_ONE)}>
                go back
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
              subText="Please check your inbox, copy the verification code and paste it in the field below to confirm your email."
            />
            <AuthInput placeholder="Insert Unique code" name="lead_reference_number" required />
            <div className={`form-buttons ${css['form-btns']}`}>
              <button
                type="button"
                className={`btn btn-gray`}
                onClick={() => goBackValidateMe(SignUpSteps.STEP_TWO)}>
                go back
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
            <AuthInput
              type="password"
              placeholder="Password"
              name="password"
              setVal={e => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            <AuthInput
              type="password"
              placeholder="Confirm Password"
              setVal={e => setConfirmPassword(e.target.value)}
              autoComplete="off"
              required
            />
            <PasswordRequirements password={password} />
            <button type="submit" className={`btn ${css['sendButton']}`} disabled={loadingFinish}>
              continue
            </button>
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
