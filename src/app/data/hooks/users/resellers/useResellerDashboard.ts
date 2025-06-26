import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useState } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';

export const useResellerDashboard = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany } = useUserData();
  const [reseller, __] = useState();

  const getResellerProfile = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: getCompany(),
      },
      path: 'resellers/dashboard',
    }).then(({ data }: any) => {});
  };

  return [reseller, { getResellerProfile, isLoading }] as const;
};
