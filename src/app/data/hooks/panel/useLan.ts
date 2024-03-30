import { useCallback, useRef, useState } from 'react';
import { type Device, useAuthState } from '../..';
import { toast } from 'react-toastify';
import { useFetcher } from '../util/useFetcher';

export interface LanProps {
	loading: boolean;
	networks: Device[];
	error: string | null;
	info: string | null;
}

/* Custom Hook "useLan" to handle recovery of all LAN apps*/
export const useLan = () => {
	const { getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const [error, setError] = useState(false);
	const dataRef = useRef<Device[]>([]);

	/* Fetch LAN  Apps */
	const fetchAllLan = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/lan',
				ac: 'view_all',
				company_id: companyID,
			},
		})
			.then(({data}: any) => {
				dataRef.current = data.disponibles;
				setError(false);
			})
			.catch(() => setError(true));
	}, []);

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchAllLan(companyID);
	};

	return { loading: isLoading, networks: dataRef.current, error, refetch };
};
