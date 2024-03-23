import { useCallback, useState } from 'react';
import {
	type Device,
	type FetchPattern,
	LanApplicationService,
	useAuthState,
} from '../..';
import { toast } from 'react-toastify';

export interface LanProps {
	loading: boolean;
	networks: Device[];
	error: string | null;
	info: string | null;
}

/* Custom Hook "useLan" to handle recovery of all LAN apps*/
export const useLan = () => {
	const { getCompany } = useAuthState();
	const [{ data, error, isLoading }, dispatch] = useState<
		FetchPattern<Device[]>
	>({
		data: null,
		error: null,
		isLoading: false,
	});
	/* Fetch LAN  Apps */
	const fetcher = useCallback((companyID: string) => {
		dispatch((state: any) => ({
			...state,
			isLoading: true,
		}));

		LanApplicationService.getAll(companyID)
			.then((response: any) => {
				dispatch({
					data: response.disponibles,
					error: null,
					isLoading: false,
				});
			})
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	}, []);

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetcher(companyID);
	};

	return { loading: isLoading, networks: data, error, refetch };
};
