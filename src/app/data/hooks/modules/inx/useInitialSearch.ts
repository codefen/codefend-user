import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

interface SearchResult {
  intelID: string;
  count: number;
  offSet: number;
  search: string;
}

export const useInitialSearch = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const [dataSearch, setSearchData] = useState<SearchResult>({
    count: 0,
    offSet: 0,
    intelID: '',
    search: '',
  });

  const fetchInitialSearch = async (companyID: string, term: string) => {
    return fetcher('post', {
      body: {
        model: 'modules/inx',
        ac: 'init_search',
        term: term,
        company_id: companyID,
      },
      requestId: `ini-${term.trim()}`,
      timeout: 10000,
    })
      .then(({ data }: any) => {
        if (typeof data === 'string') data = JSON.parse(data.trim());

        if (data?.error == '1') throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);

        setSearchData((state: SearchResult) => ({
          ...state,
          intelID: data.id || '',
          count: 0,
        }));
        return { id: data.id as string, error: 0 };
      })
      .catch((e: Error) => {
        toast.error(e.message);
        return { id: '', error: 1 };
      });
  };

  const refetchInitial = (companyID: string, term: string) => {
    if (companyIdIsNull(companyID)) return Promise.reject({ error: 1 });
    return fetchInitialSearch(companyID, term);
  };

  const getData = (): SearchResult => dataSearch;

  return { getData, setSearchData, refetchInitial, isLoading };
};
