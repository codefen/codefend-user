import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, SOURCE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const useDeleteSourceCode = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher(true);

  const fetDeleteResources = (id: string, companyID: string) => {
    fetcher('post', {
      body: {
        id: id,
        company_id: companyID,
      },
      path: 'resources/source/del',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        toast.success(SOURCE_PANEL_TEXT.DELETED_SOURCE);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  const deletedResource = (id: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    return fetDeleteResources(id, companyID);
  };

  return {
    isDeleting: isLoading,
    deletedResource,
  };
};
