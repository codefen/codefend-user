import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SUPPORT_PANEL_TEXT } from '@/app/constants/app-toast-texts';

const validators = (title: string, shortDescription: string) => {
  if (!title.trim()) {
    toast.error(SUPPORT_PANEL_TEXT.EMPTY_TICKET_TITLE);
    return true;
  }
  if (!shortDescription.trim()) {
    toast.error(SUPPORT_PANEL_TEXT.EMPTY_TICKET_DESC);
    return true;
  }
  return false;
};

export const useAddTicket = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const title = useRef<HTMLInputElement>(null);
  const shortDescription = useRef<HTMLTextAreaElement>(null);
  const { getUserdata, getCompany } = useUserData();

  const fetchAdd = async (params: any, userID: string, companyID: string) => {
    return fetcher('post', {
      body: {
        model: 'cs/index',
        ac: 'add',
        user_id: userID,
        company_id: companyID,
        ...params,
      },
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        return;
      }
      toast.success(SUPPORT_PANEL_TEXT.ADD_TICKET);
    });
  };

  const addTicket = (): any => {
    const companyID = getCompany();
    const userID = getUserdata().id;
    if (
      companyIdIsNull(companyID) ||
      validators(title.current?.value || '', shortDescription.current?.value || '')
    )
      return Promise.reject(false);

    const params = {
      condicion: 'open',
      cs_header: title.current?.value || '',
      cs_body: shortDescription.current?.value || '',
    };
    return fetchAdd(params, userID, companyID);
  };

  return { isAddingTicket: isLoading, addTicket, title, shortDescription };
};
