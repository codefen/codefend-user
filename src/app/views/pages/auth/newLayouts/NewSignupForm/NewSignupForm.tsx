import { ModalWrapper } from '@modals/index';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import css from './signinform.module.scss';
import { companySizesList } from '@mocks/defaultData';
import { useFetcher } from '#commonHooks/useFetcher';
import { defaultCountries } from '@/app/constants/countries';
import { apiErrorValidation, isEquals, passwordValidation } from '@/app/constants/validations';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { toast } from 'react-toastify';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import { useLocation, useSearchParams } from 'react-router';
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
  const fnameRef = useRef<string>('');
  const lnameRef = useRef<string>('');
  const emailRef = useRef<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setLoading(true);
      getRecommendedUsername(code)
        .then(() => {
          setActiveStep(SignUpSteps.STEP_FOUR);
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
    const formObject = Object.fromEntries(form.entries());
    localStorage.setItem('signupFormData', JSON.stringify(formObject));
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
    form.append('company_area', defaultCountries.filter(i => i.alpha2Code === country.get)[0].name);
    form.append('idiom', 'en');
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
    signUpFinish(formObject).then((user: any) => {
      if (user) {
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
        <ChangeAuthPages pathname={location.pathname} />
        <img src="/codefend/brand-iso.png" width={350} height={60} />
        <p>{STEPSDATA[activeStep].p}</p>
        <ProgressBar activeStep={activeStep} />
        <Show when={activeStep === SignUpSteps.STEP_ONE && !specialLoading}>
          <form onSubmit={nextFirstStep}>
            <AuthInput
              placeholder="First name"
              name="lead_fname"
              autoComplete="given-name"
              required
            />
            <AuthInput
              placeholder="Last name"
              name="lead_lname"
              autoComplete="family-name"
              required
            />
            <AuthInput
              type="email"
              name="lead_email"
              autoComplete="email"
              placeholder="Email"
              required
            />
            <PhoneInput name="lead_phone" defaultCountry={country.get} />
            <button type="submit" className={`btn ${css['sendButton']}`}>
              continue
            </button>
          </form>
        </Show>
        <Show when={activeStep === SignUpSteps.STEP_TWO && !specialLoading}>
          <form onSubmit={nextSecondStep}>
            <AuthInput placeholder="Company Name" name="company_name" required />
            <AuthInput placeholder="Company website (Ej. myweb.com)" name="company_web" required />
            <SelectField
              name="company_size"
              options={[
                { value: '', label: 'Select Company Size', hidden: true },
                ...companySizesList.map(company => ({
                  value: company.value,
                  label: company.label,
                })),
              ]}
              defaultValue=""
              required
            />
            <SelectField
              name="lead_role"
              options={[
                { value: '', label: 'role', hidden: true },
                { value: 'admin', label: 'administrative' },
                { value: 'human', label: 'human resources' },
                { value: 'info', label: 'information tech' },
                { value: 'ads', label: 'marketing' },
                { value: 'sales', label: 'sales' },
                { value: 'finance', label: 'finance' },
                { value: 'cs', label: 'customer service' },
                { value: 'prod', label: 'production & ops' },
                { value: 'plan', label: 'strategy & planning' },
                { value: 'law', label: 'legal affairs' },
              ]}
              defaultValue=""
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
        <Show when={activeStep === SignUpSteps.STEP_THREE && !specialLoading}>
          <form onSubmit={nextThreeStep}>
            <CheckEmail
              text="we have sent you an email with a code!"
              subText="Please check your inbox, copy the verification code and paste it in the field below to confirm your email."
            />
            <AuthInput placeholder="Unique code" name="lead_reference_number" required />
            <button type="submit" className={`btn ${css['sendButton']}`} disabled={isLoading}>
              send code
            </button>
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
        <Show when={activeStep === SignUpSteps.STEP_FOUR && !specialLoading}>
          <form onSubmit={nextFourStep}>
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
              send code
            </button>
          </form>
        </Show>
        <Show when={specialLoading && !!searchParams.get('code')}>
          <div>
            <PageOrbitLoader />
          </div>
        </Show>
      </div>
    </ModalWrapper>
  );
};
