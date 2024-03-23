import { useCallback, useState } from 'react';
import { type CloudApp,type  FetchPattern, ResourcesTypes, mapCloudApp, useAuthState, useOrderStore, verifySession } from '../..';
import { CloudService } from '../../services/panel/cloud.service';
import { toast } from 'react-toastify';

export const useCloud = () => {
	const { getCompany,logout } = useAuthState();
	const { updateState,setScopeTotalResources } = useOrderStore((state) => state);
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
					
					const cloudResources = response.disponibles.map((app: any) => mapCloudApp(app));
					
					dispatch({
						data: cloudResources,
						error: null,
						isLoading: false,
					});
					setScopeTotalResources(cloudResources.length)
				}
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false })).finally(()=> updateState("resourceType", ResourcesTypes.CLOUD));
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
