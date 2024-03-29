import { useCallback, useRef, useState } from 'react';
import { useAuthState } from '..';
import {type MemberV2, verifySession, useOrderStore, ResourcesTypes } from '../../../data';
import { toast } from 'react-toastify';
import { useFetcher } from '../util/useFetcher';

/* Custom Hook "useSocial" to handle GET data in Social page*/
export const useSocial = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const data = useRef<MemberV2[]>([]);
	const { updateState,setScopeTotalResources } = useOrderStore((state) => state);
	
	const fetchSocial = (companyID: string) => {
		fetcher("post", {
			body: {
				model: 'resources/se',
				ac: 'view_all',
				company_id: companyID,
			}
		}).then((response: any) => {
				verifySession(response, logout);

				const socialResources = response?.disponibles || [];
				console.log({ socialResources });
				data.current = socialResources;
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

	return { members: data.current, loading: isLoading, refetch };
};
