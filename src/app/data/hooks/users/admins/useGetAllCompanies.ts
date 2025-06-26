import { useCallback, useEffect, useState } from 'react';
import { type CompanyInfo } from '@interfaces/panel.ts';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { verifySession } from '@/app/constants/validations';

const useGetAllCompanies = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const { getCompany, logout } = useUserData();

  const fetchCompanyInfo = useCallback(() => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: companyID,
      },
      path: 'companies/dashboard',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }
      setCompanyInfo(data);
    });
  }, []);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  return { companyInfo, loading: isLoading };
};

export default useGetAllCompanies;
