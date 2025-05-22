import { useRef, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { APP_EVENT_TYPE } from '@interfaces/panel';

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
  const { getCompany, getUserdata, logout, company } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const query = new URLSearchParams(useLocation().search);
  const [searchData, setSearchData] = useState(query.get('search') || '');
  const [searchClass, setSearchClass] = useState<string>(query.get('class') || 'email');
  const intelDataRef = useRef<any[]>([]);
  const appEvent = useGlobalFastField('appEvent');
  const { updateState } = useOrderStore();

  const fetchSearch = (companyID: string) => {
    intelDataRef.current = [];
    let searchDataParsed = searchData;
    if (searchClass === 'email') {
      searchDataParsed = searchDataParsed.trim();
    }
    return fetcher('post', {
      body: {
        company_id: companyID,
        keyword: searchDataParsed,
        class: searchClass,
      },
      path: 'modules/sns/search',
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (apiErrorValidation(data)) {
          const customError: any = new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
          customError.code = data?.error_info || 'generic';
          throw customError;
        }
        const arrayOfObjects = !!data?.response?.results
          ? Object.entries(data.response.results).map(([key, value]) => {
              const name = key.split('_').slice(1, -2).join('_');
              return { name, value: value as PersonInfo[] };
            })
          : [];
        intelDataRef.current = arrayOfObjects;
        updateCompany(data.company);
        if (arrayOfObjects.length === 0 || data.response.size == 0) {
          toast.warning(APP_MESSAGE_TOAST.SEARCH_NOT_FOUND);
        }
      })
      .catch(error => {
        switch (error.code) {
          case 'paid_user_leaksearch_maximum_reached':
            limitReached();
            break;
          default:
            toast.error(error.message || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
      });
  };

  const limitReached = () => {
    updateState('open', true);
    updateState('orderStepActive', OrderSection.PAYWALL_MAX_SCAN);
    updateState('resourceType', ResourcesTypes.WEB);
    appEvent.set(APP_EVENT_TYPE.LIMIT_REACHED_SNS);
  };
  const updateCompany = (companyUpdated: any) => {
    if (companyUpdated) company.set(companyUpdated);
  };

  const handleSearch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    return fetchSearch(companyID);
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
    limitReached,
    company,
    updateCompany,
  } as const;
};
