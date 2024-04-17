import { toast } from 'react-toastify';
import { useAuthState } from '../../index.ts';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import {  verifySession } from '../../../index.ts';
import { useProviderProfileStore } from '../../../store/provider.store.ts';


export const useProviderProfile = () => {
	const { getCompany, getUserdata, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
    const {provider, setProvider, setLogicSequence} = useProviderProfileStore((state)=> state);

	const refetch = () => {
		const companyID = getCompany();

		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		fetcher<any>('post', {
			body: {
				company_id: companyID,
				provider_id: getUserdata().id,
				model: 'providers/profiles/view',
			},
            insecure: true
		})?.then(({ data }) => {
            if(Number(data.error) !== 0) throw new Error("A problem has occurred with the provider profile");

			verifySession(data, logout);

            setProvider(data.provider);
            setLogicSequence(data.logic_sequence);
		});
	};

	return { providerProfile: provider, isLoading, refetch, cancelRequest, setProvider } as const;
};

