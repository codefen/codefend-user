import { useCallback, useState } from 'react';
import {
	MobileApp,
	MobileProps,
	MobileService,
	MobileUnique,
	mapMobileProps,
	mobileUniqueProps,
	useAuthState,
} from '../..';
import { toast } from 'react-toastify';
import { FetchPattern } from 'app/data/interfaces/util';

export const useMobile = () => {
	const { getCompany } = useAuthState();

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
				dispatch({
					data: mapMobileProps(response),
					error: null,
					isLoading: false,
				}),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
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

export const useMobileOne = (id: string) => {
	const [mobile, setMobile] = useState<MobileUnique | null>(null);
	const [isLoding, setLoading] = useState<boolean>(false);

	/* Fetch cloud app */
	const fetch = useCallback(() => {
		const { getUserdata } = useAuthState();
		const mobileInfo = getUserdata();
		setLoading(true);
		MobileService.getMobileByID(id, mobileInfo?.companyID as string)
			.then((response) => {
				setMobile(mobileUniqueProps(response));
			})
			.catch((error: any) => {
				console.error(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	/* Refetch func*/
	const refetch = useCallback(() => fetch(), []);

	/* Utilities func */
	const getMobile = useCallback((): MobileUnique => {
		return !isLoding && mobile ? mobile : ({} as MobileUnique);
	}, [mobile, isLoding]);


	return { isLoding, getMobile, refetch };
};
