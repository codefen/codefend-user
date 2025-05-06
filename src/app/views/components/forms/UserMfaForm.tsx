import { useEffect, useState, type FC, type FormEvent, type ReactNode } from 'react';
import { useFetcher } from '@/app/data/hooks/common/useFetcher';
import { useUserData } from '@/app/data/hooks/users/common/useUserData';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { LockClosedIcon } from '@icons';
import { toast } from 'react-toastify';
import { apiErrorValidation } from '@/app/constants/validations';

interface UserMfaFormProps {
  onDone?: () => void;
  children: (isLoading: boolean) => ReactNode;
  className?: string;
}

export const UserMfaForm: FC<UserMfaFormProps> = ({ onDone, children, className = '' }) => {
  const [fetcher, , isLoading] = useFetcher();
  const [qr, setQr] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const { getCompany } = useUserData();

  useEffect(() => {
    fetcher('post', {
      body: { company_id: getCompany() || '' },
      path: 'users/mfa',
      requireSession: true,
    })
      .then(({ data }: any) => {
        setQr(data?.qr || '');
        setKey(data?.llave || '');
      })
      .catch(() => {
        setQr('');
        setKey('');
      });
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const code = formData.get('mfaCode') as string;
    // Enviar el código y la llave al backend
    fetcher('post', {
      path: 'users/mfa',
      requireSession: true,
      body: {
        company_id: getCompany() || '',
        mfa_code: code,
        mfa_llave: key,
      },
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data?.error, data?.response)) {
          throw new Error(data.info);
        }

        if (onDone) onDone();
      })
      .catch((error: any) => {
        toast.error(error.message || 'Error validating code');
        form.reset();
      });
  };

  return (
    <form className={`form ${className}`} onSubmit={handleSubmit} autoComplete="off">
      {qr && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img src={qr} alt="MFA QR Code" style={{ maxWidth: 160, margin: '0 auto' }} />
        </div>
      )}
      <ModalInput icon={null} name="mfaCode" placeholder="Ingresa el código de tu app" required />
      {children(isLoading)}
    </form>
  );
};
