import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { COMUNIQUE_KEYS } from '@/app/constants/app-texts';

export const useSolvedComunique = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const solvedComunique = () => {
    const id = localStorage.getItem(COMUNIQUE_KEYS.ID) || '';
    if (!id) return;
    fetcher('post', {
      body: {
        model: 'users/communiques/solved',
        id: id,
        company_id: getCompany(),
      },
    }).then(() => {
      localStorage.removeItem(COMUNIQUE_KEYS.ID);
    });
  };

  return { solvedComunique };
};
