import { useState, type FC, type FormEvent, type ReactNode } from 'react';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';
import { toast } from 'react-toastify';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';

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
      if (apiErrorValidation(data?.error, data?.response)) {
        toast.error('The new password or the old password is invalid');
        return;
      }
      toast.success('Password updated successfully');
      form.reset();
      if (onDone) onDone();
    });
  };

  // PasswordRequirements necesita el valor de la nueva contraseña, pero como no hay estado, lo obtenemos del último submit
  // Si se quiere mostrar en tiempo real, habría que usar useState, pero siguiendo tu pedido, solo lo mostramos tras submit

  return (
    <form className={`form ${className}`} onSubmit={handleSubmit} autoComplete="off">
      <ModalInput
        icon={null}
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        required
      />
      <ModalInput
        icon={null}
        type="password"
        name="newPassword"
        placeholder="New Password"
        required
        setValue={(val: string) => setPasswordValue(val)}
      />
      <ModalInput
        icon={null}
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <PasswordRequirements password={passwordValue} />
      {children(isLoading)}
    </form>
  );
};
