import { useState, type FC, type FormEvent, type ReactNode } from 'react';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';
import { toast } from 'react-toastify';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';

// Íconos para mostrar/ocultar contraseña
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

interface ChangePasswordFormProps {
  onDone?: () => void;
  children: (isLoading: boolean) => ReactNode;
  className?: string;
}

export const ChangePasswordForm: FC<ChangePasswordFormProps> = ({
  onDone,
  children,
  className = '',
}) => {
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany } = useUserData();

  const [passwordValue, setPasswordValue] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = data.get('currentPassword') as string;
    const newPassword = data.get('newPassword') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    fetcher('post', {
      requireSession: true,
      body: {
        company_id: getCompany() || '',
        previous_password: currentPassword,
        new_password: newPassword,
      },
      path: 'users/password/mod',
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        toast.error('The new password or the old password is invalid');
        return;
      }
      toast.success('Password updated successfully');
      form.reset();
      setPasswordValue('');
      if (onDone) onDone();
    });
  };

  // PasswordRequirements necesita el valor de la nueva contraseña, pero como no hay estado, lo obtenemos del último submit
  // Si se quiere mostrar en tiempo real, habría que usar useState, pero siguiendo tu pedido, solo lo mostramos tras submit

  return (
    <form 
      className={`form ${className}`} 
      onSubmit={handleSubmit} 
      autoComplete="off"
      style={{ 
        rowGap: '0.5rem',
        // Override the default margin-top from form-input to match login spacing
      }}>
      <div style={{ marginTop: 0 }}>
        <ModalInput
          icon={null}
          type={showCurrentPassword ? 'text' : 'password'}
          name="currentPassword"
          placeholder="Current Password"
          required
          showPasswordToggle={true}
          isPasswordVisible={showCurrentPassword}
          onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
        />
      </div>
      <div style={{ marginTop: 0 }}>
        <ModalInput
          icon={null}
          type={showNewPassword ? 'text' : 'password'}
          name="newPassword"
          placeholder="New Password"
          required
          setValue={(val: string) => setPasswordValue(val)}
          showPasswordToggle={true}
          isPasswordVisible={showNewPassword}
          onTogglePassword={() => setShowNewPassword(!showNewPassword)}
        />
      </div>
      <div style={{ marginTop: 0 }}>
        <ModalInput
          icon={null}
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          showPasswordToggle={true}
          isPasswordVisible={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </div>
      <PasswordRequirements password={passwordValue} />
      {children(isLoading)}
    </form>
  );
};
