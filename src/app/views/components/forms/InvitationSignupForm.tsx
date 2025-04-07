import { useSignupInvitation } from '@userHooks/auth/useSignupInvitation';
import { useEffect, type FC, type FormEvent, type ReactNode } from 'react';
import { useParams } from 'react-router';
import AuthSelectedField from '../AuthSelectedField/AuthSelectedField.tsx';
import { AuthInput } from '@/app/views/components/defaults/AuthInput.tsx';

const roleOptions = [
  { value: '', label: 'role', hidden: true },
  { value: 'admin', label: 'administrative' },
  { value: 'human', label: 'human resources' },
  { value: 'info', label: 'information tech' },
  { value: 'ads', label: 'marketing' },
  { value: 'sales', label: 'sales' },
  { value: 'finance', label: 'finance' },
  { value: 'cs', label: 'customer service' },
  { value: 'prod', label: 'production & ops' },
  { value: 'plan', label: 'strategy & planning' },
  { value: 'law', label: 'legal affairs' },
];
const idiomOptions = [
  { value: '', label: 'Idiom', hidden: true },
  { value: 'ar', label: 'Arabic' },
  { value: 'en', label: 'English' },
];

const InvitationSignupForm: FC<{
  children: (isLoading: boolean) => ReactNode;
}> = ({ children }) => {
  const { ref } = useParams();
  const { setForm, sendSignUp, isLoading } = useSignupInvitation();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    sendSignUp();
  };

  useEffect(() => {
    setForm((current: any) => ({
      ...current,
      invokeHash: ref || '',
    }));
  }, [ref]);

  const handleChange = (field: string) => (val: any) => {
    setForm(current => ({
      ...current,
      [field]: val,
    }));
  };
  const handleChangeSelect = (field: string) => (e: any) => {
    setForm(current => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthInput
        setVal={handleChange('invokeHash')}
        placeholder="Invitation Code"
        autoComplete="off"
        required
      />
      <AuthInput
        type="email"
        setVal={handleChange('invokeEmail')}
        autoComplete="email"
        placeholder="Email address"
        required
      />
      <AuthInput
        setVal={handleChange('name')}
        placeholder="First name"
        autoComplete="given-name"
        required
      />
      <AuthInput
        setVal={handleChange('lastname')}
        autoComplete="family-name"
        placeholder="Last name"
        required
      />
      <AuthInput
        setVal={handleChange('username')}
        placeholder="Username"
        autoComplete="off"
        required
      />
      <AuthInput type="tel" setVal={handleChange('phone')} placeholder="Phone number" required />
      <AuthSelectedField options={roleOptions} onChange={handleChangeSelect('role')} required />
      <AuthSelectedField options={idiomOptions} onChange={handleChangeSelect('idiom')} required />
      <AuthInput
        type="password"
        setVal={handleChange('password')}
        placeholder="Password"
        required
      />
      {children(isLoading)}
    </form>
  );
};

export default InvitationSignupForm;
