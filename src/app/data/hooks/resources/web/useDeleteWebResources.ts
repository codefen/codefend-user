import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const useDeleteWebResource = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();

  const handleDelete = async (onDone: () => void | null, id: string): Promise<any> => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher<any>('post', {
      body: {
        model: 'resources/web/del',
        resource_id: id,
        company_id: companyID,
      },
    })
      .then(({ data }) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }

        toast.success(WEB_PANEL_TEXT.DELETED_WEB);
        if (onDone && onDone !== undefined) onDone();
      })
      .catch((error: any) => {
        toast.error(error.message);
        close?.();
      });
  };

  return { handleDelete, isDeletingResource: isLoading };
};
