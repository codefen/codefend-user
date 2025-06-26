import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import type { ResourceCredential } from '@interfaces/creds';
import { useState } from 'react';

export const useViewCredentials = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const [credentials, setCredentials] = useState<ResourceCredential[]>([]);

  const getCredentials = (type: string, id: string) => {
    fetcher('post', {
      body: {
        company_id: getCompany(),
        resource_class: type,
        resource_id: id,
      },
      path: 'creds/index',
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) throw new Error('');

      setCredentials(data.disponibles ? data.disponibles : []);
    });
  };

  return [credentials, { getCredentials, isLoading }] as const;
};
