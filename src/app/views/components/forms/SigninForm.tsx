import { useLocation, useNavigate } from 'react-router';
import { AuthInput } from '@/app/views/components/defaults/AuthInput.tsx';
import { useRef, type FC, type FormEvent, type ReactNode } from 'react';
import { useLoginAction } from '@userHooks/auth/useLoginAction.ts';

const SigninForm: FC<{
  children: (isLoading: boolean) => ReactNode;
}> = ({ children }) => {
  const { signInUser, isLoading } = useLoginAction();
  const navigate = useNavigate();
  const location = useLocation();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    signInUser(email.current?.value || '', password.current?.value || '', '').then((user: any) => {
      const state = location.state;
      if (user && state && state?.redirect) {
        navigate(state.redirect);
      } else if (user) {
        if (user?.accessRole == 'user') navigate('/');
        if (user?.accessRole == 'admin') navigate('/admin');
        if (user?.accessRole == 'provider') navigate('/provider/profile');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthInput
        ref={email}
        type="email"
        placeholder="Email address"
        autoComplete="email"
        required
      />
      <AuthInput
        ref={password}
        type="password"
        placeholder="Password"
        autoComplete="off"
        required
      />
      {children(isLoading)}
    </form>
  );
};

export default SigninForm;
