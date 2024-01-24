import { useCallback, useEffect, useState } from 'react';
import { Device, LanApplicationService, useAuthState } from '..';

export interface LanProps {
	loading: boolean;
	networks: Device[];
	error: string | null;
	info: string | null;
}

export const useLan = () => {
	const { getUserdata } = useAuthState();
	const [loading, setLoading] = useState<boolean>(false);
	const [networks, setNetworks] = useState<Device[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	const fetchLan = useCallback(() => {
		const user = getUserdata();
		const companyID = user?.companyID as string;
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
	}, [getUserdata]);

	useEffect(() => {
		fetchLan();
	}, []);

	const refetch = useCallback(() => fetchLan(), []);

	return { loading, networks, error, info, refetch };
};
