import { useNavigate, useParams } from 'react-router';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import { isEquals, passwordValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { PasswordRequirements } from '../auth/PasswordRequirements';
import { usePasswordRecovery } from '@userHooks/auth/usePasswordRecovery';
import CheckEmail from '../auth/CheckEmail';
import InputFieldWithLabel from '../auth/InputFieldWithLabel';

const PasswordRecoveryForm: FC<{
  children: (isLoading: boolean) => ReactNode;
  activePhase: 'email' | 'code';
  setPhase: (updated: 'email' | 'code') => void;
}> = ({ children, activePhase, setPhase }) => {
  const { ref } = useParams();
  const navigate = useNavigate();
  const { sendEmailForRecovery, passwordRecover, isLoading } = usePasswordRecovery();
  const [passwordRecovery, setPasswordRecovery] = useState({
    email: '',
    referenceNumber: '',
    newPassword: '',
    repeatedPassword: '',
  });
  useEffect(() => {
    setPasswordRecovery((current: any) => ({
      ...current,
      referenceNumber: ref || '',
    }));
    if (ref) {
      setPhase('code');
    }
  }, [ref]);

  const handleSendCode = async (e: any) => {
    e.preventDefault();
    sendEmailForRecovery(passwordRecovery.email);
    setPhase('code');
    toast.success(AUTH_TEXT.SEND_RECOVERY_CODE);
  };

  const handlePasswordRecovery = (e: any) => {
    e.preventDefault();
    if (!passwordValidation(passwordRecovery.newPassword)) {
      toast.error(AUTH_TEXT.INVALID_PASSWORD);
      return;
    }
    if (!isEquals(passwordRecovery.newPassword, passwordRecovery.repeatedPassword)) {
      toast.error(AUTH_TEXT.PASSWORD_NOT_MATCH);
      return;
    }
    passwordRecover(
      passwordRecovery.email,
      passwordRecovery.referenceNumber,
      passwordRecovery.newPassword
    )
      .then(res => {
        if (res.error != '0') throw new Error(res.info);

        toast.success(AUTH_TEXT.PASSWORD_UPDATED);
        setPhase('email');
        setPasswordRecovery({
          email: '',
          referenceNumber: '',
          newPassword: '',
          repeatedPassword: '',
        });
        navigate('/auth/signin');
      })
      .catch(err => {
        toast.error(AUTH_TEXT.FAILURE_PASSWORD_UPDATED);
      });
  };

  const handleInputChange = (field: string) => (e: any) => {
    setPasswordRecovery(current => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  return (
    <form
      onSubmit={activePhase === 'email' ? handleSendCode : handlePasswordRecovery}
      className="signup-confirm">
      {activePhase === 'email' ? (
        <>
          <CheckEmail
            text="Enter your email to identify the account"
            subText="If the email is registered, we will send you a verification code so you can change your password"
          />
          <InputFieldWithLabel
            label="Email"
            type="email"
            value={passwordRecovery.email}
            onChange={handleInputChange('email')}
            name="email"
            placeholder="Enter email"
            required
          />
        </>
      ) : (
        <>
          <InputFieldWithLabel
            label="Reference number"
            type="text"
            value={passwordRecovery.referenceNumber}
            onChange={handleInputChange('referenceNumber')}
            name="referenceNumber"
            placeholder="Enter reference number"
            required
          />
          <InputFieldWithLabel
            label="New password"
            type="password"
            value={passwordRecovery.newPassword}
            onChange={handleInputChange('newPassword')}
            name="newPassword"
            placeholder="Enter new password"
            required
          />
          <InputFieldWithLabel
            label="Repeat new password"
            type="password"
            value={passwordRecovery.repeatedPassword}
            onChange={handleInputChange('repeatedPassword')}
            name="repeatedPassword"
            placeholder="Enter new password"
            required
          />
          <PasswordRequirements password={passwordRecovery.newPassword} />
        </>
      )}
      {children(isLoading)}
    </form>
  );
};

export default PasswordRecoveryForm;
