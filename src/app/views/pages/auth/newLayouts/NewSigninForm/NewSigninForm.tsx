import { ModalWrapper } from '@modals/index';
import css from './signinform.module.scss';
import { useLoginAction } from '@userHooks/auth/useLoginAction';
import { Link, useLocation, useNavigate } from 'react-router';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';

export const NewSigninForm = () => {
  const { signInUser, isLoading } = useLoginAction();
  const navigate = useNavigate();
  const location = useLocation();

  const [mfaStep, setMfaStep] = useState(false);
  const [formValues, setFormValues] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [mfaCode, setMfaCode] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // if (mfaStep) {
    //   // Aquí deberías llamar a la función que verifica el MFA con el código, email y password
    //   // Por ahora solo simulo el éxito y redirijo
    //   // TODO: conectar con endpoint real de verificación MFA
    //   window.location.href = '/';
    //   return;
    // }
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get('email') as unknown as string;
    const password = form.get('password') as unknown as string;
    setFormValues({ email, password });
    signInUser(email || '', password || '').then((result: any) => {
      if (result?.mfaRequired) {
        setMfaStep(true);
        return;
      }
      if (result?.error === 'invalid_username_or_password') {
        return;
      }
      const state = location.state;
      if (result && !result.error) {
        if (state && state?.redirect) {
          navigate(state.redirect);
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

        <p>Welcome back! Please sign in</p>
        <form onSubmit={handleSubmit}>
          <div className={mfaStep ? css['hide-for-mfa'] : ''}>
            <AuthInput
              placeholder="Email"
              type="email"
              name="email"
              autoComplete="email"
              required
              defaultValue={formValues.email}
            />
            <AuthInput
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="off"
              required
              defaultValue={formValues.password}
            />
          </div>
          {mfaStep && (
            <AuthInput
              placeholder="MFA Code"
              type="text"
              name="mfa"
              autoComplete="one-time-code"
              required
              value={mfaCode}
              setVal={(value: any) => setMfaCode(value)}
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
            Forgot password?
          </Link>
        )}
      </div>
    </ModalWrapper>
  );
};
