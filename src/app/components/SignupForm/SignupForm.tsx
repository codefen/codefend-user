import { ModalWrapper } from '@modals/index';
import { useEffect, useState, type FormEvent } from 'react';
import css from './signinform.module.scss';
import { SignUpSteps, STEPSDATA } from '@/app/constants/newSignupText';
import { ProgressBar } from '@/app/components/ProgressBar/ProgressBar';
import Show from '@/app/components/Show/Show';
import { AuthInput } from '@/app/components/AuthInput/AuthInput';
import PhoneInput from '@/app/components/PhoneInput/PhoneInput';
import SelectField from '@/app/components/SelectField/SelectField';
import { companySizesList } from '@mocks/defaultData';
import { useUserLocationStore } from '@stores/useLocation.store';
import { useFetcher } from '#commonHooks/useFetcher';
import { defaultCountries } from '@/app/constants/countries';
import CheckEmail from '@/app/components/CheckEmail/CheckEmail';
import { PasswordRequirements } from '@/app/components/PasswordRequirements/PasswordRequirements';
import { apiErrorValidation, isEquals, passwordValidation } from '@/app/constants/validations';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { toast } from 'react-toastify';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { PageOrbitLoader } from '@defaults/index';

export const SignupForm = () => {
  const [activeStep, setActiveStep] = useState(SignUpSteps.STEP_ONE);
  const [fetcher, _, isLoading] = useFetcher();
  const { country } = useUserLocationStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lead_reference_number, setLeadReferenceNumber] = useState('');
  const [username, setRecommendedUsername] = useState('');
  const [specialLoading, setLoading] = useState(false);
  const { signUpFinish, isLoading: loadingFinish } = useRegisterPhaseTwo();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    form.append('company_area', defaultCountries.filter(i => i.alpha2Code === country)[0].name);
    form.append('idiom', 'en');
    form.append('reseller_id', '1');
    form.append('reseller_name', 'codefend');
    // Endpoint reference
    form.append('phase', '1');
    form.append('model', 'users/new');
    const formObject = Object.fromEntries(form.entries());
    fetcher('post', { body: formObject, requireSession: false }).then(({ data }: any) => {
      if (apiErrorValidation(data?.error, data?.response)) throw new Error('');
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
        navigate('/');
      }
    });
  };
  const isSigninActive = location.pathname === '/signin';
  return (
    <ModalWrapper showCloseBtn={false} type={css['signinform']}>
      <div className={css['signupContent']}>
        <div className={css['change-page-contaienr']}>
          <Link to="/signin" className={isSigninActive ? css['active-link'] : ''}>
            Signin
          </Link>
          <Link to="/signup" className={!isSigninActive ? css['active-link'] : ''}>
            Signup
          </Link>
        </div>
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
            <PhoneInput name="lead_phone" defaultCountry={country} />
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
            <button type="submit" className={`btn ${css['sendButton']}`} disabled={isLoading}>
              validate me!
            </button>
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
