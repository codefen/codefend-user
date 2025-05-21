import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { verifySession } from '@/app/constants/validations';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useProviderCompanies = () => {
  const { getUserdata, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const companies = useGlobalFastField('companies');

  const getProviderCompanyAccess = () => {
    const companyID = getUserdata()?.company_id;
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: companyID,
      },
      path: 'providers/companies/access',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }
      if (data.accessible_companies && data.accessible_companies.length > 0) {
        const accessible_companies = data.accessible_companies.filter(
          (comapny: any) => comapny !== null
        );
        companies.set(accessible_companies);
      }
    });
  };

  return { getProviderCompanyAccess, isLoading };
};
