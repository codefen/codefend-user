import { useNavigate } from 'react-router';
import { companySizesList } from '@mocks/defaultData.ts';
import { countries } from '@/app/constants/countries';
import { useRegisPhaseOne } from '@userHooks/auth/useRegisPhaseOne';
import { useDefineUserReseller } from '@userHooks/auth/useDefineUserReseller';
import { TermsOfUse } from '../TermsOfUse/TermsOfUse.tsx';
import SelectField from '../AuthSelectedField/AuthSelectedField.tsx';
import type { FC, FormEvent, ReactNode } from 'react';
import { AuthInput } from '@/app/views/components/defaults/AuthInput.tsx';

export const SignupForm: FC<{
  children: (isLoading: boolean) => ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const {
    signUpUser,
    isLoading,
    givenName,
    familyName,
    email,
    phone,
    company,
    companyWeb,
    companyRole,
    companySize,
  } = useRegisPhaseOne();
  const { updateResellerArea, updateReseller, resellers, companyCountry, reseller } =
    useDefineUserReseller();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    signUpUser(companyCountry, reseller.name, reseller.id).then((isSuccess): any => {
      if (isSuccess) navigate('/auth/confirmation');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthInput ref={givenName} placeholder="First name" autoComplete="given-name" required />
      <AuthInput ref={familyName} placeholder="Last name" autoComplete="family-name" required />
      <AuthInput ref={email} type="email" autoComplete="email" placeholder="Email" required />
      <AuthInput ref={phone} type="tel" placeholder="Phone number" required />
      <AuthInput ref={company} placeholder="Company Name" required />
      <AuthInput ref={companyWeb} placeholder="example.com" required />

      <SelectField
        ref={companySize}
        options={[
          { value: '', label: 'Select Company Size', hidden: true },
          ...companySizesList.map(company => ({
            value: company.value,
            label: company.label,
          })),
        ]}
        defaultValue=""
        required
      />

      <SelectField
        ref={companyRole}
        options={[
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
        ]}
        defaultValue=""
        required
      />

      <SelectField
        options={[
          { value: '', label: 'Select your country', hidden: true },
          ...Array.from(countries).map(country => ({
            value: country.value,
            label: country.label,
          })),
        ]}
        onChange={updateResellerArea}
        required
      />

      <SelectField
        options={[
          { value: '', label: 'Select your reseller', hidden: true },
          ...resellers.map(reseller => ({
            value: reseller.id,
            label: reseller.name,
          })),
        ]}
        onChange={updateReseller}
        value={reseller.id}
        required
      />

      {/* 
      <SelectField
        ref={idiom}
        options={[
          { value: '', label: 'Idiom', hidden: true },
          { value: 'ar', label: 'Arabic' },
          { value: 'en', label: 'English' },
        ]}
        defaultValue=""
        required
      />
      */}

      <TermsOfUse />
      {children(isLoading)}
    </form>
  );
};
