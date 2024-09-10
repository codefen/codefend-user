import { useRef, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

interface PersonInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  gender?: string;
  lastip?: string;
  username?: string;
  country?: string;
  created?: string;
  followers?: string;
  hash?: string;
  id?: string;
  birthdate?: string;
  regdate?: string;
  uid?: string;
  [key: string]: any;
}

export const useSns = () => {
  const { getCompany, getUserdata } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const query = new URLSearchParams(useLocation().search);
  const [searchData, setSearchData] = useState(query.get('search') || '');
  const [searchClass, setSearchClass] = useState<string>(query.get('class') || 'email');
  const intelDataRef = useRef<any[]>([]);

  const fetchSearch = (companyID: string) => {
    intelDataRef.current = [];
    fetcher('post', {
      body: {
        model: 'modules/sns',
        ac: 'search',
        company_id: companyID,
        keyword: searchData,
        class: searchClass,
      },
    }).then(({ data }: any) => {
      const arrayOfObjects = Object.entries(data.response.results).map(([key, value]) => {
        const name = key.split('_').slice(1, -2).join('_');
        return { name, value: value as PersonInfo[] };
      });
      intelDataRef.current = arrayOfObjects;

      if (arrayOfObjects.length === 0 || data.response.size == 0) {
        toast.warning(APP_MESSAGE_TOAST.SEARCH_NOT_FOUND);
      }
    });
  };

  const handleSearch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchSearch(companyID);
  };

  return {
    searchData,
    searchClass,
    isLoading,
    intelData: intelDataRef.current,
    handleSearch,
    getUserdata,
    setSearchData,
    setSearchClass,
  } as const;
};
