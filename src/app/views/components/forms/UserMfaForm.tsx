import { useEffect, useState, type FC, type FormEvent, type ReactNode } from 'react';
import { useFetcher } from '@/app/data/hooks/common/useFetcher';
import { useUserData } from '@/app/data/hooks/users/common/useUserData';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { toast } from 'react-toastify';
import { apiErrorValidation, verifySession } from '@/app/constants/validations';

interface UserMfaFormProps {
  onDone?: () => void;
  children: (isLoading: boolean) => ReactNode;
  className?: string;
}

export const UserMfaForm: FC<UserMfaFormProps> = ({ onDone, children, className = '' }) => {
  const [fetcher, , isLoading] = useFetcher();
  const [qr, setQr] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const { getCompany, user, logout } = useUserData();

  useEffect(() => {
    fetcher('post', {
      body: { company_id: getCompany() || '' },
      path: 'users/mfa',
      requireSession: true,
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout) || apiErrorValidation(data)) throw new Error('');
        setQr(data?.qr || '');
        setKey(data?.llave || '');
        if (data?.user) user.set(data?.user);
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
        if (apiErrorValidation(data)) {
          throw new Error(data.info);
        }
        toast.success('MFA enabled successfully');
        if (onDone) onDone();
      })
      .catch((error: any) => {
        toast.error(error.message || 'Error validating code');
        form.reset();
      });
  };

  return (
    <form className={`form ${className}`} onSubmit={handleSubmit} autoComplete="off">
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <img
          src={qr}
          alt="MFA QR Code"
          style={{ margin: '0 auto' }}
          width={160}
          height={160}
          decoding="async"
          className={!qr ? 'blur-overlay' : ''}
        />
      </div>
      <ModalInput icon={null} name="mfaCode" placeholder="Authenticator code" required />
      {children(isLoading)}
    </form>
  );
};
