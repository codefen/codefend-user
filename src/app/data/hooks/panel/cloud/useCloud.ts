import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '../../util/useFetcher';
import {
	type CloudApp,
	ResourcesTypes,
	mapCloudApp,
	useAuthState,
	useOrderStore,
	verifySession,
} from '../../..';

export const useCloud = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const { updateState, setScopeTotalResources } = useOrderStore(
		(state) => state,
	);
	const [data, setData] = useState<CloudApp[]>([]);

	/* Fetch Cloud Apps */
	const fetchAll = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/cloud',
				ac: 'view_all',
				company_id: companyID,
			},
		}).then(({ data }: any) => {
				verifySession(data, logout);

				const cloudResources = data?.disponibles ? data.disponibles.map((app: any) =>
					mapCloudApp(app),
				) : [];

				setData(cloudResources)
				setScopeTotalResources(cloudResources.length);
			}).finally(() => updateState('resourceType', ResourcesTypes.CLOUD));
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
