import { useCallback, useState } from 'react';
import { CloudApp, FetchPattern, mapCloudApp, useAuthState, verifySession } from '../..';
import { CloudService } from '../../services/panel/cloud.service';
import { toast } from 'react-toastify';

export const useCloud = () => {
	const { getCompany,logout } = useAuthState();
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<CloudApp[]>>({
		data: null,
		error: null,
		isLoading: false,
	});
	/* Fetch Cloud Apps */
	const fetchAll = useCallback((companyID: string) => {
		dispatch((state: any) => ({
			...state,
			isLoading: true,
		}));
		
		CloudService.getAll(companyID)
			.then((response: any) =>
				{
					verifySession(response, logout);
					
					dispatch({
						data: response.disponibles.map((app: any) => mapCloudApp(app)),
						error: null,
						isLoading: false,
					})
				}
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	}, []);

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchAll(companyID);
	};

	/* UTILITIES. */
	const getCloudInfo = (): CloudApp[] => {
		const _data = !isLoading ? data : [];
		return _data ?? ([] as CloudApp[]);
	};

	return {
		getCloudInfo,
		isLoading,
		refetch,
	};
};
