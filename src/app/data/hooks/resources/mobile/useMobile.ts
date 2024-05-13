import { useRef } from 'react';
import {
	type MobileApp,
	ResourcesTypes,
	mapMobileProps,
	useOrderStore,
	verifySession,
} from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

export const useMobile = () => {
	const { logout } = useUserData();
	const { getCompany} = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);
	const { updateState, setScopeTotalResources } = useOrderStore(
		(state) => state,
	);

	const mobileData = useRef<MobileApp[]>([]);

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetcher<any>('post', {
			body: {
				model: 'resources/mobile',
				ac: 'view_all',
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				verifySession(data, logout);
				const resourcces = mapMobileProps(data);
				mobileData.current = resourcces.available;
				setScopeTotalResources(resourcces.available.length);
			})
			.finally(() => {
				updateState('resourceType', ResourcesTypes.MOBILE);
			});
	};

	const getMobileInfo = (): MobileApp[] =>
		!isLoading ? mobileData.current : [];

	return {
		isLoading,
		getMobileInfo,
		refetch,
	};
};


