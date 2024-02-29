import { useCallback, useEffect, useState } from 'react';
import { Device, LanApplicationService, useAuthState } from '..';

export interface LanProps {
	loading: boolean;
	networks: Device[];
	error: string | null;
	info: string | null;
}

export const useLan = () => {
	const { getCompany, getUserdata } = useAuthState();
	const [loading, setLoading] = useState<boolean>(false);
	const [networks, setNetworks] = useState<Device[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	const fetchLan = useCallback(() => {
		const companyID = getCompany();
		setLoading(true);

		LanApplicationService.getAll(companyID)
			.then((response: any) => {
				setNetworks(response.disponibles);
				setInfo(response.info);
				setError(response.error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [getCompany, getUserdata]);

	useEffect(() => {
		fetchLan();
	}, []);

	const refetch = useCallback(() => fetchLan(), []);

	return { loading, networks, error, info, refetch };
};
