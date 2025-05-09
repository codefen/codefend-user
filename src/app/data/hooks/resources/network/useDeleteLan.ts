import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, NETWORK_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const useDeleteLan = (onDone: () => void, close: () => void) => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const [selectedLanIdToDelete, setSelectedLanIdToDelete] = useState<string>('');

  /* Fetch LAN  Apps */
  const fetchDelete = useCallback((companyID: string, deletedId: string) => {
    fetcher('post', {
      body: {
        id: deletedId,
        company_id: companyID,
      },
      path: 'resources/lan/del',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        close();
        onDone();
        toast.success(NETWORK_PANEL_TEXT.DELETED_LAN);
      })
      .catch((e: Error) => toast.error(e.message));
  }, []);

  /* Refetch Function. */
  const refetch = (id: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;

    fetchDelete(companyID, id);
  };

  return {
    selectedLanIdToDelete,
    setSelectedLanIdToDelete,
    isLoading,
    refetch,
  };
};
