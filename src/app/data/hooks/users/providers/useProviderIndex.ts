import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import type { Provider } from '@interfaces/provider';
import { useRef } from 'react';

export const useProviderIndex = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const providers = useRef<Provider[]>();

  const getProviders = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;

    fetcher<any>('post', {
      body: {
        company_id: companyID,
      },
      path: 'providers/profiles/index',
    }).then(({ data }: any) => {
      if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
        throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
      }
      providers.current = data?.providers ? data.providers : [];
    });
  };

  return [getProviders, { providers, isLoading }] as const;
};
