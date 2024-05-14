import { useCallback, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import {
	type CloudApp,
	ResourcesTypes,
	mapCloudApp,
	useOrderStore
} from '../../..';
import { verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export const useCloud = () => {
	const { logout } = useUserData();
	const { getCompany} = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);
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
				if(verifySession(data, logout)) return;
				if (apiErrorValidation(data?.error, data?.response)) {
					throw new Error('An error has occurred on the server');
				}

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
		if (companyIdIsNotNull(companyID)) return;
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
