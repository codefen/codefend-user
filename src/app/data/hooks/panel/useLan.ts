import { useCallback, useState } from 'react';
import {
	Device,
	FetchPattern,
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

export const useLan = () => {
	const { getUserdata } = useAuthState();
	const [{ data, error, isLoading }, dispatch] = useState<
		FetchPattern<Device[]>
	>({
		data: null,
		error: null,
		isLoading: false,
	});
	/* Fetch Cloud Apps */
	const fetchLan = useCallback((companyID: string) => {
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
		const companyID = getUserdata()?.companyID;
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchLan(companyID);
	};

	return { loading: isLoading, networks: data, error, refetch };
};
