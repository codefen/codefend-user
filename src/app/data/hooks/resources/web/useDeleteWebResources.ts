import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useInitialDomainStore } from '@stores/initialDomain.store';

export const useDeleteWebResource = () => {
  const { getCompany, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const { webResourceSelected, appEvent } = useGlobalFastFields([
    'webResourceSelected',
    'appEvent',
  ]);
  const { update, resourceId } = useInitialDomainStore();

  const handleDelete = async (): Promise<any> => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher<any>('post', {
      body: {
        resource_id: webResourceSelected.get.id,
        company_id: companyID,
      },
      path: 'resources/web/del',
    })
      .then(({ data }) => {
        if (apiErrorValidation(data)) {
          if (verifySession(data, logout)) return;
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        if (webResourceSelected.get.id === resourceId) {
          update('resourceId', '');
          update('initialDomain', '');
        }
        appEvent.set(APP_EVENT_TYPE.WEB_RESOURCE_DELETED);
        toast.success(WEB_PANEL_TEXT.DELETED_WEB);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  };

  return { handleDelete, isDeletingResource: isLoading, selected: webResourceSelected.get };
};
