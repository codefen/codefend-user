import { useRef } from 'react';
import { toast } from 'react-toastify';
import {type MemberV2, verifySession, useOrderStore, ResourcesTypes } from '../../..';
import { useAuthState } from '../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';

/* Custom Hook "useSocial" to handle GET data in Social page*/
export const useSocial = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	
	const dataRef = useRef<MemberV2[]>([]);
	const { updateState,setScopeTotalResources } = useOrderStore((state) => state);
	
	const fetchSocial = (companyID: string) => {
		fetcher("post", {
			body: {
				model: 'resources/se',
				ac: 'view_all',
				company_id: companyID,
			}
		}).then(({ data }: any) => {
				verifySession(data, logout);

				const socialResources = data?.disponibles || [];
				console.log({ socialResources });
				dataRef.current = socialResources;
				setScopeTotalResources(socialResources.length);
			}).finally(()=> updateState("resourceType", ResourcesTypes.SOCIAL));
	}

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchSocial(companyID);
	};

	return { members: dataRef.current, loading: isLoading, refetch };
};
