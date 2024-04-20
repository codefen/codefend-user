import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import {  verifySession } from '../../../index.ts';
import { useProviderProfileStore } from '../../../store/provider.store.ts';
import { useUserData } from '#commonUserHooks/useUserData.ts';


export const useProviderProfile = () => {
	const { getUserdata, logout } = useUserData();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
    const {provider, setProvider, setLogicSequence} = useProviderProfileStore((state)=> state);

	const refetch = () => {
		fetcher<any>('post', {
			body: {
				company_id: getUserdata().company_id,
				provider_id: getUserdata().id,
				model: 'providers/profiles/view',
			}
		})?.then(({ data }) => {
            if(Number(data.error) !== 0) throw new Error("");

			verifySession(data, logout);

            setProvider(data.provider);
            setLogicSequence(data.logic_sequence);
		}).catch(()=>toast.error("A problem has occurred with the provider profile"));
	};

	return { providerProfile: provider, isLoading, refetch, cancelRequest, setProvider } as const;
};

