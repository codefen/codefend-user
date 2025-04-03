import { ModalWrapper } from '@modals/index';
import css from './signinform.module.scss';
import { useLoginAction } from '@userHooks/auth/useLoginAction';
import { Link, useLocation, useNavigate } from 'react-router';
import { type FormEvent } from 'react';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';

export const NewSigninForm = () => {
  const { signInUser, isLoading } = useLoginAction();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get('email') as unknown as string;
    const password = form.get('password') as unknown as string;
    signInUser(email || '', password || '').then((user: any) => {
      const state = location.state;
      if (user && state && state?.redirect) {
        navigate(state.redirect);
      } else if (user) {
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
      <div className={css['signinContent']}>
        <div className={css['change-page-contaienr']}>
          <Link to="/signin" className={location.pathname === '/signin' ? css['active-link'] : ''}>
            Signin
          </Link>
          <Link to="/signup" className={location.pathname === '/signup' ? css['active-link'] : ''}>
            Signup
          </Link>
          <Link
            to="/recovery"
            className={location.pathname.startsWith('/recovery') ? css['active-link'] : ''}>
            Password recovery
          </Link>
        </div>
        <img src="/codefend/brand-iso.png" width={350} height={60} />
        <p>Bienvenido de nuevo! Inicia sesion</p>
        <form onSubmit={handleSubmit}>
          <AuthInput placeholder="Email" type="email" name="email" autoComplete="email" required />
          <AuthInput
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="off"
            required
          />
          <button type="submit" className={`btn ${css['sendButton']}`} disabled={isLoading}>
            continue
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};
