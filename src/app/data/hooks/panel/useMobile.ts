import { useRef, useState } from 'react';
import {
	type MobileApp,
	ResourcesTypes,
	mapMobileProps,
	useAuthState,
	useOrderStore,
	verifySession,
} from '../..';
import { toast } from 'react-toastify';
import { useFetcher } from '../util/useFetcher';

export const useMobile = () => {
	const { getCompany, logout } = useAuthState();
	const { updateState, setScopeTotalResources } = useOrderStore(
		(state) => state,
	);
	const [fetcher, cancelRequest, isLoading] = useFetcher();

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

export const useAddMobileResource = () => {
	const [fetcher, cancelRequest, isLoading] = useFetcher();

	const [androidAddress, setAndroidAddress] = useState('');
	const [iosAddress, setIosAddress] = useState('');
	const { getCompany } = useAuthState();

	const isNotValidData = ()=>{
		if (androidAddress.length > 165) {
			toast.error('Invalid android address');
			setIsAddingMobile(false);
			return true;
		}

		if (iosAddress.length > 165) {
			toast.error('Invalid ios address');
			setIsAddingMobile(false);
			return true;
		}

		if (!iosAddress.trim() && !androidAddress.trim()) {
			toast.error('Kindly fill in field(s)');
			setIsAddingMobile(false);
			return true;
		}

		return false;
	}

	const handleAddMobileResource = (
		onDone: () => void,
		onClose: () => void,
	) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		if(isNotValidData()) return;

		fetcher<any>('post', {
			body: {
				model: 'resources/mobile',
				ac: 'add',
				app_android_link: androidAddress,
				app_apple_link: iosAddress,
				company_id: companyID,
			},
		})
			.then((response: any) => {
				if (
					response.android_error ||
					response.apple_error ||
					response.isAnError
				) {
					throw new Error(
						response.android_info ??
							'An error has occurred on the server',
					);
				}

				onDone();
				onClose();
				toast.success('Successfully Added Mobile App...');
			})
			.catch((error: Error) => {
				toast.error(error.message);
				onClose();
			});
	};

	return {handleAddMobileResource, isAddingMobile: isLoading, setIosAddress, setAndroidAddress};
};
