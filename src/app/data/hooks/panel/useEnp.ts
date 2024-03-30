import { useCallback, useRef, useState } from 'react';
import { useFetcher } from '../util/useFetcher';
import { useAuthState } from '../../';
import { invoke } from '@tauri-apps/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const useFetchEndpoints = (companyID: string, scanID: number) => {
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const dataRef = useRef<any>();

	const fetchEnd = async (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'modules/epm/devices',
				ac: 'get',
				scan_id: scanID,
				company_id: companyID,
			},
		}).then(({ data }: any) => {
			dataRef.current = data;
		});
	};

	const refetch = async () => {
		fetchEnd(companyID);
	};

	const getEndpoints = () => {
		const endData = isLoading ? ({} as any) : dataRef;
		return endData || {};
	};

	return { getEndpoints, isLoading, refetch };
};

// Hook para manejar el escaneo local
export const useScanLocal = (token: string) => {
	const [scanLoading, setScanLoading] = useState(false);
	const navigate = useNavigate();

	const handleScanResult = (result: any) => {
		if (result.success) {
			return true;
		}
		return false;
	};

	const scanLocal = useCallback(async () => {
		setScanLoading(true);
		try {
			const resParsed = JSON.parse(
				await invoke('scan_local', { sessionId: token }),
			);
			return handleScanResult(resParsed);
		} catch (error: any) {
			console.error({ error });
			toast.error(JSON.parse(error).error);
		} finally {
			setScanLoading(false);
			navigate(0);
		}
		return false;
	}, [token, handleScanResult]);

	return { scanLoading, scanLocal };
};

// Hook principal que utiliza los hooks anteriores
export const useEnp = (scanID: number) => {
	const { getCompany } = useAuthState();
	const companyID = getCompany();

	const { getEndpoints, isLoading, refetch } = useFetchEndpoints(
		companyID,
		scanID,
	);

	return {
		getEndpoints,
		isLoading,
		refetch,
	};
};
