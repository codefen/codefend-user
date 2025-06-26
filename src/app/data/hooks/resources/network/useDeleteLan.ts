import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, NETWORK_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';

export const useDeleteLan = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const { networkResourceSelected, appEvent } = useGlobalFastFields([
    'networkResourceSelected',
    'appEvent',
  ]);
  const lanText = `${networkResourceSelected.get?.device_ex_address ? networkResourceSelected.get?.device_ex_address + ' / ' : ''}${networkResourceSelected.get?.device_in_address || ''}`;

  /* Fetch LAN  Apps */
  const fetchDelete = useCallback((companyID: string, deletedId: string) => {
    return fetcher('post', {
      body: {
        id: deletedId,
        company_id: companyID,
      },
      path: 'resources/lan/del',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        networkResourceSelected.set(null);
        appEvent.set(APP_EVENT_TYPE.NETWORK_RESOURCE_DELETED);
        toast.success(NETWORK_PANEL_TEXT.DELETED_LAN);
      })
      .catch((e: Error) => toast.error(e.message));
  }, []);

  /* Refetch Function. */
  const refetch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject(false);

    return fetchDelete(companyID, networkResourceSelected.get?.id);
  };

  return {
    isLoading,
    refetch,
    lanText,
  };
};
