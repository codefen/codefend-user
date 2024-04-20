import { useRef } from 'react';
import { ResourcesTypes, useOrderStore, verifySession, type Device } from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

export interface LanProps {
	loading: boolean;
	networks: Device[];
	error: string | null;
	info: string | null;
}

/* Custom Hook "useLan" to handle recovery of all LAN apps*/
export const useLan = () => {
	const { getCompany , logout} = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const { setScopeTotalResources,updateState } = useOrderStore((state) => state);
	const dataRef = useRef<Device[]>([]);

	/* Fetch LAN  Apps */
	const fetchAllLan = (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/lan',
				ac: 'view_all',
				company_id: companyID,
			},
		})
			.then(({data}: any) => {
				verifySession(data, logout);
				
				dataRef.current = data.disponibles ? data.disponibles : [];

				setScopeTotalResources(dataRef.current.length);
			}).finally(() => updateState('resourceType', ResourcesTypes.NETWORK));
	};

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchAllLan(companyID);
	};

	return { loading: isLoading, networks: dataRef.current, refetch };
};
