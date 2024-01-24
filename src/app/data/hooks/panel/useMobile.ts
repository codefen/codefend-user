import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
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

export const useSelectedMobile = () => {
	const [selectedMobileApp, setSelectedMobileApp] = useState<MobileApp | null>(
		null,
	);

	const isCurrentMobileSelected = (id: string) => {
		let idSelected = selectedMobileApp ? selectedMobileApp?.id : '';
		return id === idSelected;
	};

	const isNotNull = () =>
		selectedMobileApp !== null && selectedMobileApp !== undefined;

	const changeMobile = (mobile: MobileApp) => {
		if (mobile && !isCurrentMobileSelected(mobile.id)) {
			setSelectedMobileApp(mobile);
		}
	};

	return {
		isNotNull,
		isCurrentMobileSelected,
		changeMobile,
		selectedMobileApp,
		setSelectedMobileApp,
	};
};

export const useMobile = () => {
	const { getUserdata } = useAuthState();

	const [{ data, error, isLoading }, dispatch] = useState<
		FetchPattern<MobileProps>
	>({
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
		const companyID = getUserdata()?.companyID;
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

	const getMobile = useCallback((): MobileUnique => {
		return !isLoding && mobile ? mobile : ({} as MobileUnique);
	}, [mobile, isLoding]);

	const refetch = useCallback(() => fetch(), []);

	return { isLoding, getMobile, refetch };
};
