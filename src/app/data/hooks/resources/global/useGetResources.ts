import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useGetResources = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher(true);

  // - - -  refetch data  - - -
  const getAnyResource = (path?: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject([]);
    return fetcher<any>('post', {
      body: {
        company_id: companyID,
        childs: 'yes',
      },
      path: `resources/${path}/index`,
    })
      .then(({ data }) => {
        if (apiErrorValidation(data?.error, data?.response)) throw new Error('');

        let resources = [];
        if (data.resources) resources = data.resources;
        if (!Boolean(resources.length) && data.disponibles) resources = data.disponibles;
        return resources;
      })
      .catch(() => []);
  };

  return { isLoading, getAnyResource };
};
