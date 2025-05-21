import { useFetcher } from '#commonHooks/useFetcher';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import type { RegisterParams } from '@interfaces/auth';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export const useRegisPhaseOne = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const givenName = useRef<HTMLInputElement>(null);
  const familyName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const company = useRef<HTMLInputElement>(null);
  const companyWeb = useRef<HTMLInputElement>(null);

  const companyRole = useRef<HTMLSelectElement>(null);
  const companySize = useRef<HTMLSelectElement>(null);
  const idiom = useRef<HTMLSelectElement>(null);

  const signUpUser = async (companyCountry: string, resellerNme: string, resellerId: string) => {
    const requestParams: RegisterParams = {
      lead_fname: givenName.current?.value || '',
      lead_lname: familyName.current?.value || '',
      lead_email: email.current?.value || '',
      lead_phone: phone.current?.value || '',
      company_name: company.current?.value || '',
      company_web: companyWeb.current?.value || '',
      company_size: companySize.current?.value || '',
      company_area: companyCountry,
      reseller_name: resellerNme,
      reseller_id: resellerId,
      idiom: idiom.current?.value || 'en',
    };
    return fetcher('post', {
      body: {
        model: 'users/new',
        phase: '1',
        ...requestParams,
      },
    })
      .then(({ data }: any) => {
        if (data.email_error === '1' || apiErrorValidation(data)) {
          if (data.email_error === '1') {
            throw new Error(data.email_info);
          }
          throw new Error(data.info);
        }
        toast.success(AUTH_TEXT.REGISTER_PHASE_ONE);
        return true;
      })
      .catch((error: Error) => {
        toast.error(error.message);
        return false;
      });
  };

  return {
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
    idiom,
  };
};
