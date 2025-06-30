import { useRef } from 'react';
import { toast } from 'react-toastify';
import { maPreviousSearch } from '@utils/mapper';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export interface PreviousSearch {
  id: string;
  company_id: string;
  user_id: string;
  username: string;
  model: string;
  info: string;
  address_ra: string;
  address_hci: string;
  address_hxff: string;
  user_pais: string;
  user_pais_code: string;
  user_pais_provincia: string;
  user_pais_ciudad: string;
  user_ua: string;
  condicion: string;
  eliminado: string;
  creacion: string;
}

export const usePreviousSearch = (mod: string) => {
  const { getCompany, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const dataRef = useRef<PreviousSearch[]>([]);
  const company = useGlobalFastField('company');

  const fetchInitialSearch = async (companyID: string) => {
    fetcher('post', {
      body: {
        company_id: companyID,
      },
      path: `${mod}/view_previous`,
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout)) return;

        if (apiErrorValidation(data)) {
          throw new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        if (data?.company) company.set(data.company);
        dataRef.current = data?.previous_searches
          ? data?.previous_searches.map(
              (searches: any) => maPreviousSearch(searches) as PreviousSearch
            )
          : [];
      })
      .catch((e: Error) => toast.error(e.message));
  };

  const refetch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchInitialSearch(companyID);
  };

  const getData = (): PreviousSearch[] => {
    return !isLoading ? dataRef.current : [];
  };

  return { previousSearches: getData(), isLoading, refetch };
};
