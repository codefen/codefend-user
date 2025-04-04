import { useNavigate, useParams } from 'react-router';
import { useEffect, useState, type FC, type FormEvent, type ReactNode } from 'react';
import { isEquals, passwordValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useRecomendedUsername } from '#commonUserHooks/useRecomendedUsername';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import type { RegisterFinishParams } from '@interfaces/auth';
import { PasswordRequirements } from '../PasswordRequirements/PasswordRequirements';
import { AuthInput } from '@/app/views/components/defaults/AuthInput';

const FinishSignupForm: FC<{
  children: (isLoading: boolean) => ReactNode;
}> = ({ children }) => {
  const { signUpFinish, isLoading } = useRegisterPhaseTwo();
  const { ref } = useParams();
  const { data } = useRecomendedUsername(ref);

  const [userState, setUserState] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    ref: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setUserState((prev: any) => ({
      ...prev,
      ref: ref || '',
      username: data ? data?.recommended_username || '' : '',
    }));
  }, [ref, data]);

  const handleChange = (field: string, value: any) => {
    setUserState(prevUserState => ({
      ...prevUserState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passwordValidation(userState.password)) {
      toast.error(AUTH_TEXT.INVALID_PASSWORD);
      return;
    }
    if (!isEquals(userState.password, userState.confirmPassword)) {
      toast.error(AUTH_TEXT.PASSWORD_NOT_MATCH);
      return;
    }

    const requestParams: RegisterFinishParams = {
      username: userState.username,
      password: userState.password,
      lead_reference_number: userState.ref,
    };
    signUpFinish(requestParams).then((user: any) => {
      if (user) {
        if (user?.accessRole == 'user') navigate('/');
        if (user?.accessRole == 'admin') navigate('/admin');
        if (user?.accessRole == 'provider') navigate('/provider/profile');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          value={userState.username}
          onChange={e => handleChange('username', e.target.value)}
          type="text"
          placeholder="Username"
          autoComplete="off"
          required
        />
      </div>
      <AuthInput
        setVal={val => handleChange('password', val)}
        type="password"
        placeholder="Password"
        autoComplete="off"
        required
      />
      <AuthInput
        setVal={val => handleChange('confirmPassword', val)}
        type="password"
        placeholder="Confirm Password"
        autoComplete="off"
        required
      />
      <PasswordRequirements password={userState.password} />

      {children(isLoading)}
    </form>
  );
};

export default FinishSignupForm;
