import { useRef } from 'react';
import { useOrderStore, ResourcesTypes } from '../../..';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

/* Custom Hook "useSocial" to handle GET data in Social page*/
export const useSocial = () => {
	const { updateState, setScopeTotalResources } = useOrderStore(
		(state) => state,
	);
	const { getCompany, logout } = useUserData();
	const swrKeYRef = useRef<any>([
		['resources/se', "view_all"],
		{ company: getCompany(), logout },
	]);

	const { data, mutate, isLoading, isValidating } = useSWR(
		swrKeYRef.current,
		(key: any) => disponibleFetcher(key),
		{
			...defaultConfig,
			onSuccess: () => {
				setScopeTotalResources(data.length);
				updateState('resourceType', ResourcesTypes.SOCIAL);
			},
		},
	);

	return {
		members: data,
		isLoading: isLoading || isValidating,
		refetch: () =>
			mutate(undefined, {
				revalidate: true,
				optimisticData: data,
			}),
	};
};
