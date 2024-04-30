import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

interface NetworkData {
	desc: string;
	internalAddress: string;
	externalAddress: string;
}


export const useAddLan = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const [
		{
			desc,
			internalAddress,
			externalAddress,
		},
		setNetworkData,
	] = useState<NetworkData>({
		desc: '',
		internalAddress: '',
		externalAddress: '',
	});
	/* Fetch LAN  Apps */
	const fetchOne = useCallback((params: any, companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/lan',
				ac: 'add',
				company_id: companyID,
				...params,
			},
		}).then(({ data }: any) => {
			if (data.error == 1 || data.response === "error") {
				let message = data.info.includes('device_in_address')
					? 'Device internal address is invalid'
					: data.info.includes('device_ex_address')
						? 'device external address is invalid'
						: 'An unexpected error has occurred on the server';

				toast.error(message);
				return;
			}
			toast.success('successfully added Access Point...');

			close();
			onDone();
		});
	}, []);

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		const requestParams = {
			device_desc: desc,
			device_in_address: internalAddress,
			device_ex_address: externalAddress,
		};
		fetchOne(requestParams, companyID);
	};



	return {
		internalAddress,
		externalAddress,
		isLoading,
		refetch,
        setNetworkData
	};
};
