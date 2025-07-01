import { ModalWrapper } from '@modals/index';
import css from './signinform.module.scss';
import { useLoginAction } from '@userHooks/auth/useLoginAction';
import { Link, useLocation, useNavigate } from 'react-router';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';
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

export const NewSigninForm = () => {
  const { signInUser, isLoading } = useLoginAction();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get('email') as unknown as string;
    const password = form.get('password') as unknown as string;
    const mfa = form.get('mfa') as unknown as string;
    signInUser(email || '', password || '', mfa || '').then((result: any) => {
      if (result?.mfaRequired) {
        sendEventToGTM({
          event: 'signin_mfa_required',
          category: 'auth',
          action: 'signin',
          label: 'signin_mfa_required',
        });
        setMfaStep(true);
        return;
      }
      if (result?.error === 'invalid_username_or_password') {
        sendEventToGTM({
          event: 'signin_error',
          category: 'auth',
          action: 'signin',
          label: 'invalid_username_or_password',
        });
        return;
      }
      const state = location.state;
      if (result && !result.error) {
        sendEventToGTM({
          event: 'signin_success',
          category: 'auth',
          action: 'signin',
          label: 'signin_success',
        });
        if (state && state?.redirect) {
          // navigate(state.redirect);
          window.location.href = state.redirect || '/';
        } else {
          window.location.href = '/';
        }
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['signinform']}>
      <div className={css['signinContent']}>
        <img src="/codefend/logo-color.png" width={220} />
        <ChangeAuthPages pathname={location.pathname} />

        <p>
          {mfaStep
            ? 'This account has two-factor authentication enabled, please complete the verification process.'
            : 'Welcome back'}
        </p>
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
          <button type="submit" className={`btn ${css['sendButton']}`} disabled={isLoading}>
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
      </div>
    </ModalWrapper>
  );
};
