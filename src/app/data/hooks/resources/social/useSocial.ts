import { useRef } from 'react';
import { toast } from 'react-toastify';
import {type MemberV2, verifySession, useOrderStore, ResourcesTypes } from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

/* Custom Hook "useSocial" to handle GET data in Social page*/
export const useSocial = () => {
	const { logout } = useUserData();
	const { getCompany} = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);
	
	const dataRef = useRef<MemberV2[]>([]);
	const { updateState,setScopeTotalResources } = useOrderStore((state) => state);
	
	const fetchSocial = (companyID: string) => {
		fetcher<any>("post", {
			body: {
				model: 'resources/se',
				ac: 'view_all',
				company_id: companyID,
			}
		}).then(({ data }: any) => {
				verifySession(data, logout);

				const socialResources = data?.disponibles || [];
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
