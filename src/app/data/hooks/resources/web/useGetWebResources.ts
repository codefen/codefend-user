import { useState } from 'react';
import { verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import type { Webresource } from '@interfaces/panel';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useGetWebResources = () => {
  const { getCompany, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher(true);
  const [webResources, setWebResources] = useState<Webresource[]>([]);
  const company = useGlobalFastField('company');

  const refetch = (childs?: string) => {
    const companyID = getCompany();
    console.log('companyID', companyID);
    if (companyIdIsNull(companyID)) return;

    fetcher<any>('post', {
      body: {
        company_id: companyID,
        childs: childs ? childs : 'yes',
      },
      path: 'resources/web/index',
    }).then(({ data }) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }
      console.log('data', data);
      if (data?.company) company.set(data.company);
      const resources = data?.resources ? data.resources : [];
      setWebResources(resources);
    });
  };

  return { webResources, isLoading, refetch };
};
