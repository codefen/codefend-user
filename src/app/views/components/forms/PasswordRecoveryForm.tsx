import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import { isEquals, passwordValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { usePasswordRecovery } from '@userHooks/auth/usePasswordRecovery';
import InputFieldWithLabel from '../InputFieldWithLabel/InputFieldWithLabel';
import { PasswordRequirements } from '../PasswordRequirements/PasswordRequirements';
import CheckEmail from '@/app/views/components/CheckEmail/CheckEmail';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';

const PasswordRecoveryForm: FC<{
  children: (isLoading: boolean) => ReactNode;
  activePhase: 'email' | 'code';
  setPhase: (updated: 'email' | 'code') => void;
}> = ({ children, activePhase, setPhase }) => {
  const { ref } = useParams();
  const navigate = useNavigate();
  const { sendEmailForRecovery, passwordRecover, isLoading } = usePasswordRecovery();
  const [providedEmail, setProvidedEmail] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  useEffect(() => {
    setReferenceNumber(ref || '');
    if (ref) {
      setPhase('code');
    }
  }, [ref]);

  useEffect(() => {
    if (activePhase === 'email') {
      setProvidedEmail('');
      setReferenceNumber('');
      setNewPassword('');
    } else if (activePhase === 'code') {
      setNewPassword('');
    }
  }, [activePhase]);

  const handleSendCode = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('provided_email') as string;
    sendEmailForRecovery(email).then(() => {
      setProvidedEmail(email);
      setPhase('code');
      toast.success(AUTH_TEXT.SEND_RECOVERY_CODE);
      setReferenceNumber('');
      form.reset();
    });
  };

  const handlePasswordRecovery = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    if (!passwordValidation(form.get('new_password') as string)) {
      toast.error(AUTH_TEXT.INVALID_PASSWORD);
      return;
    }
    if (!isEquals(form.get('new_password') as string, form.get('repeated_password') as string)) {
      toast.error(AUTH_TEXT.PASSWORD_NOT_MATCH);
      return;
    }
    passwordRecover(
      providedEmail,
      form.get('password_recover_hash') as string,
      form.get('new_password') as string
    )
      .then(res => {
        if (res.error != '0') throw new Error(res.info);
        toast.success(AUTH_TEXT.PASSWORD_UPDATED);
        setPhase('email');
        navigate('/auth/signin');
      })
      .catch(err => {
        toast.error(AUTH_TEXT.FAILURE_PASSWORD_UPDATED);
      });
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
          <AuthInput
            type="email"
            name="provided_email"
            id="email_provided_email"
            placeholder="Enter email"
            required
          />
        </>
      ) : (
        <>
          <AuthInput
            type="email"
            value={providedEmail}
            name="provided_email"
            placeholder="Enter email"
            id="code_provided_email"
            required
            disabled={providedEmail !== ''}
          />
          <AuthInput
            type="text"
            defaultValue={referenceNumber}
            name="password_recover_hash"
            id="code_password_recover_hash"
            placeholder="Enter reference number"
            required
            disabled={referenceNumber !== ''}
          />
          <AuthInput
            type="password"
            name="new_password"
            placeholder="Enter new password"
            setVal={e => setNewPassword(e.target.value)}
            required
          />
          <AuthInput
            type="password"
            name="repeated_password"
            placeholder="Repeat new password"
            required
          />
          <PasswordRequirements password={newPassword} />
        </>
      )}
      {children(isLoading)}
    </form>
  );
};

export default PasswordRecoveryForm;
