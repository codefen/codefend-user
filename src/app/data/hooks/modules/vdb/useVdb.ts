import { toast } from 'react-toastify';
import { type ResultsVdbSearchV2, mapVdbResultV2 } from '../../..';
import { type ChangeEvent, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { companyIdIsNull } from '@/app/constants/validations';

/* Custom Hook "useInitialVdb" to handle the search result in vdb */
export const useInitialVdb = () => {
  const { getCompany } = useUserData();
  const { search } = useParams();
  const [searchData, setSearchData] = useState('');
  const vdbResults = useRef<ResultsVdbSearchV2[]>([]);
  const [fetcher, _, isLoading] = useFetcher();

  const fetchInitialVdb = async (companyID: string, search: string) => {
    return fetcher('post', {
      body: {
        model: 'modules/vdb_new',
        ac: 'search',
        company_id: companyID,
        keyword: search,
      },
    }).then(({ data }: any) => {
      vdbResults.current = Array.isArray(data)
        ? data.map((result: any) => mapVdbResultV2(result))
        : [];
      if (!Boolean(vdbResults.current.length)) {
        toast.warning(APP_MESSAGE_TOAST.SEARCH_NOT_FOUND);
      }
    });
  };

  const refetch = () => {
    setSearchData(search ?? '');
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchInitialVdb(companyID, searchData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchData(e.target.value);
  };

  return { vdbResults, refetch, isLoading, searchData, handleChange };
};
