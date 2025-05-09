import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { COMUNIQUE_KEYS } from '@/app/constants/app-texts';
import { apiErrorValidation } from '@/app/constants/validations';

export const useSolvedComunique = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const solvedComunique = () => {
    const id = localStorage.getItem(COMUNIQUE_KEYS.ID) || '';

    fetcher('post', {
      body: {
        id: id,
        company_id: getCompany(),
      },
      path: '/users/communiques/solved',
    }).then(({ data }: any) => {
      if (!apiErrorValidation(data?.error, data?.response)) {
        localStorage.removeItem(COMUNIQUE_KEYS.ID);
      }
    });
  };

  return { solvedComunique };
};
