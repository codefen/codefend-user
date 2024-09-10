import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { verifySession } from '@/app/constants/validations';
import { useProviderProfileStore } from '../../../store/provider.store.ts';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations.ts';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts.ts';

export const useProviderProfile = () => {
  const { getUserdata, logout } = useUserData();
  const [fetcher, cancelRequest, isLoading] = useFetcher();
  const { provider, setProvider, setLogicSequence } = useProviderProfileStore(state => state);

  const refetch = () => {
    const companyID = getUserdata().company_id;
    if (companyIdIsNull(companyID)) return;
    fetcher<any>('post', {
      body: {
        company_id: companyID,
        provider_id: getUserdata().id,
        model: 'providers/profiles/view',
      },
    })
      ?.then(({ data }) => {
        if (verifySession(data, logout)) return;
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        setProvider(data.provider);
        setLogicSequence(data.logic_sequence);
      })
      .catch((e: Error) => toast.error(e.message));
  };

  return { providerProfile: provider, isLoading, refetch, cancelRequest, setProvider } as const;
};
