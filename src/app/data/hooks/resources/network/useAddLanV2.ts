import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, NETWORK_PANEL_TEXT } from '@/app/constants/app-toast-texts';

const validators = (mainDomainId: string | number) => {
  if (!Number(mainDomainId)) {
    toast.error(NETWORK_PANEL_TEXT.INVALID_DAD_NETWORK);
    return true;
  }
  return false;
};

export const useAddLanV2 = (onDone: () => void, close: () => void) => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const desc = useRef<HTMLTextAreaElement>(null);
  const internalAddress = useRef<HTMLInputElement>(null);
  const externalAddress = useRef<HTMLInputElement>(null);
  const mainDomainId = useRef<HTMLSelectElement>(null);

  /* Fetch LAN  Apps */
  const fetchSaveChild = useCallback((params: any, companyID: string) => {
    fetcher('post', {
      body: {
        company_id: companyID,
        ...params,
      },
      path: 'resources/lan/add',
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        let message = data.info.includes('device_in_address')
          ? NETWORK_PANEL_TEXT.INVALID_LAN_IN_ADDRESS
          : data.info.includes('device_ex_address')
            ? NETWORK_PANEL_TEXT.INVALID_LAN_EX_ADDRESS
            : APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR;

        toast.error(message);
        return;
      }
      toast.success(NETWORK_PANEL_TEXT.ADD_SUB_NETWORK);
      close();
      onDone();
    });
  }, []);

  /* Refetch Function. */
  const refetch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID) || validators(mainDomainId.current?.value || 0)) return;
    const requestBody = {
      device_desc: desc.current?.value || '',
      device_in_address: internalAddress.current?.value || '',
      device_ex_address: externalAddress.current?.value || '',
      resource_lan_dad: mainDomainId.current?.value || '',
    };
    fetchSaveChild(requestBody, companyID);
  };

  return {
    isLoading,
    refetch,
    mainDomainId,
    desc,
    externalAddress,
    internalAddress,
  };
};
