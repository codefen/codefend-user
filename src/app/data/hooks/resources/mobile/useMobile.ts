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
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

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
		if (companyIdIsNotNull(companyID)) return;
		
		fetcher<any>('post', {
			body: {
				model: 'resources/mobile',
				ac: 'view_all',
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				if(verifySession(data, logout)) return;
				if (apiErrorValidation(data?.error, data?.response)){
					throw new Error("");
				}
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


