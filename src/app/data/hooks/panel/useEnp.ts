import { useCallback, useContext, useState } from 'react';
import { EnpService, FetchPattern, useAuthState } from '../../';
import { invoke } from '@tauri-apps/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const useFetchEndpoints = (companyID: string, scanID: number) => {
	const [{ data, error, isLoading }, dispatch] = useState<FetchPattern<any>>({
		data: null,
		error: null,
		isLoading: true,
	});

	const fetchEnd = async (companyID: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));
		return EnpService.getEndpoints(scanID, companyID)
			.then((res) => {
				dispatch({ data: res, error: null, isLoading: false })
			}
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	};

	const refetch = async () => {

		fetchEnd(companyID);
	};

	const getEndpoints = () => {
		const endData = isLoading ? ({} as any) : data;
		return endData ?? {};
	};

	return { getEndpoints, isLoading, refetch };
};

// Hook para manejar el escaneo local
export const useScanLocal = (token: string) => {
	const [scanLoading, setScanLoading] = useState(false);
	const navigate = useNavigate();

	const handleScanResult = useCallback((result: any) => {
		if (result.success) {
			return true;
		}
		return false;
	}, []);

	const scanLocal = useCallback(async () => {
		setScanLoading(true);
		try {
			const resParsed = JSON.parse(
				await invoke('scan_local', { sessionId: token }),
			);
			return handleScanResult(resParsed)
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
	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID as string;

	const { getEndpoints, isLoading, refetch } = useFetchEndpoints(companyID, scanID);

	return {
		getEndpoints,
		isLoading,
		refetch,
	};
};