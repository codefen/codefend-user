import { useCallback, useState } from 'react';
import { EnpService, FetchPattern, useAuthState } from '../../';
import { invoke } from '@tauri-apps/api';
import { toast } from 'react-toastify';

const useFetchEndpoints = (companyID: string) => {
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<any>>({
		data: null,
		error: null,
		isLoading: true,
	});

	const fetchEnd = async (companyID: string, macAddress: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));
		return EnpService.getEndpoints(macAddress, companyID)
			.then((data) =>
				dispatch({ data: data, error: null, isLoading: false }),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	};

	const refetch = async () => {
		const response = await invoke('get_mac_addr');
		const macAddress = JSON.parse(response as any);
		if (!companyID && !macAddress) {
			toast.error('User information was not found');
			return;
		}
		fetchEnd(companyID, macAddress);
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

	const handleScanResult = useCallback((result: any) => {
		console.log({ result });
		if (result.success) {
			toast.success(result.success);
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
			return handleScanResult(resParsed);
		} catch (error) {
			console.error({ error });
			toast.error('An error occurred during scanning.');
		} finally {
			setScanLoading(false);
		}
		return false;
	}, [token, handleScanResult]);

	return { scanLoading, scanLocal };
};

// Hook para manejar la eliminación de un endpoint
const useDeleteEndpoint = (companyID: string) => {
	const handleDelete = useCallback(
		async (id: string) => {
			return EnpService.delete(id, companyID).then(() => {
				toast.success('Successfully Deleted Web Resource...');
			});
		},
		[companyID],
	);

	return { handleDelete };
};

// Hook principal que utiliza los hooks anteriores
export const useEnp = () => {
	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID as string;

	const { getEndpoints, isLoading, refetch } = useFetchEndpoints(companyID);
	const { handleDelete } = useDeleteEndpoint(companyID);

	return {
		getEndpoints,
		isLoading,
		handleDelete,
		refetch,
	};
};
