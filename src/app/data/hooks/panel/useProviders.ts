import { toast } from 'react-toastify';
import { useAuthState } from '..';
import { useFetcher } from '../util/useFetcher';
import {  verifySession } from '../..';
import { useProviderProfileStore, useProviderSidebarStore } from '../../store/provider.store';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

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
				model: 'provider/profile/view',
			},
            insecure: true
		})?.then(({ data }) => {
            if(Number(data.error) !== 0) throw new Error("A problem has occurred with the provider profile");

			verifySession(data, logout);

            setProvider(data.provider);
            setLogicSequence(data.logic_sequence);
		});
	};

	return { providerProfile: provider, isLoading, refetch, cancelRequest } as const;
};

export enum ProviderSidebarOptions {
	ABOUT,
	ORDERS,
	EXPERIENCES,
	EDUCATION,
}

export const useProviderSidebar = ()=>{
	const location = useLocation();
	const {setActiveOption, setActiveSubOption, activeOption,activeSubOption} = useProviderSidebarStore((state)=> state);
	
	useEffect(()=>{
		const active = location.pathname.split("/")[2];
		setActiveOption(active);
		setActiveSubOption(0);
	}, [location]);

    return {activeOption, activeSubOption, setActiveSubOption} as const;
}