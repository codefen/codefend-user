import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { verifySession } from '@/app/constants/validations';

export const useProviderCompanies = () => {
  const { getUserdata, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const { updateCompanies } = useAdminCompanyStore();

  const getProviderCompanyAccess = () => {
    const companyID = getUserdata().company_id;
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: companyID,
      },
      path: 'providers/companies/access',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
        throw new Error('An error has occurred on the server');
      }

      if (data.accessible_companies && data.accessible_companies.length > 0) {
        const companies = data.accessible_companies.filter((comapny: any) => comapny !== null);
        updateCompanies(companies ? companies : []);
      }
    });
  };

  return { getProviderCompanyAccess, isLoading };
};
