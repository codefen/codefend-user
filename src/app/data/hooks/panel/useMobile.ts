import { useCallback, useState } from 'react';
import {
	type MobileApp,
	type MobileProps,
	MobileService,
	ResourcesTypes,
	mapMobileProps,
	useAuthState,
	useOrderStore,
	verifySession,
	type FetchPattern 
} from '../..';
import { toast } from 'react-toastify';

export const useMobile = () => {
	const { getCompany, logout } = useAuthState();
	const { updateState, setScopeTotalResources } = useOrderStore((state) => state);
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<MobileProps>>({
		data: null,
		error: null,
		isLoading: false,
	});

	const fetchWeb = useCallback((companyID: string) => {
		dispatch((state: any) => ({
			...state,
			isLoading: true,
		}));
		MobileService.getAll(companyID)
			.then((response: any) =>
				{
					verifySession(response, logout);
					const resourcces = mapMobileProps(response);
					dispatch({
						data: resourcces,
						error: null,
						isLoading: false,
					});
					setScopeTotalResources(resourcces.available.length);
				}
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }))
			.finally(()=>{
				updateState("resourceType", ResourcesTypes.MOBILE);

				
			});
	}, []);

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchWeb(companyID);
	};

	const getMobileInfo = (): MobileApp[] => {
		const _data = !isLoading ? data?.available : [];
		return _data ?? ([] as MobileApp[]);
	};

	return {
		isLoading,
		getMobileInfo,
		refetch,
	};
};
