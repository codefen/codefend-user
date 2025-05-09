import { useSignupInvitation } from '@userHooks/auth/useSignupInvitation';
import { useEffect, useState, type FC, type FormEvent, type ReactNode } from 'react';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput.tsx';
import PhoneInput from '@/app/views/components/PhoneInput/PhoneInput.tsx';
import { idiomOptions } from '@/app/constants/newSignupText.ts';
import SelectField from '@/app/views/components/SelectField/SelectField.tsx';
import { useParams } from 'react-router';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';

const InvitationSignupForm: FC<{
  children: (isLoading: boolean) => ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const params = useParams();
  const { sendSignUp, isLoading, country } = useSignupInvitation();
  const [invitationCode, setInvitationCode] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    form.append('invoke_user_hash', invitationCode);

    const formObject = Object.fromEntries(form.entries());
    const fullNumberRaw = formObject?.['user_phone'] as string;
    const [areaCode, number] = fullNumberRaw.split(/\*+/);
    formObject['user_phone'] = `${areaCode}${number}`;
    sendSignUp(formObject);
  };

  useEffect(() => {
    setInvitationCode(params?.['ref'] ? params?.['ref'] : '');
  }, [params]);
  return (
    <form className={className} onSubmit={handleSubmit}>
      <AuthInput
        name="invoke_user_hash"
        placeholder="Invitation Code"
        autoComplete="off"
        value={invitationCode}
        setVal={() => {}}
        disabled={invitationCode.length > 0}
        required
      />
      <AuthInput
        type="email"
        name="invoke_user_email"
        autoComplete="email"
        placeholder="Email address"
        required
      />
      <AuthInput name="user_fname" placeholder="First name" autoComplete="given-name" required />
      <AuthInput name="user_lname" autoComplete="family-name" placeholder="Last name" required />
      <AuthInput name="user_username" placeholder="Username" autoComplete="off" required />
      <PhoneInput
        name="user_phone"
        defaultPhone={''}
        defaultCountry={country.get}
        changeCountryCode={countryFull => country.set(countryFull.alpha2Code)}
      />
      <SelectField name="user_idiom" options={idiomOptions} defaultValue={''} required />
      <AuthInput
        type="password"
        name="user_password"
        placeholder="Password"
        required
        value={password}
        setVal={e => setPassword(e.target.value)}
      />
      <PasswordRequirements password={password} />
      {children(isLoading)}
    </form>
  );
};

export default InvitationSignupForm;
