import { useCallback, useRef, useState } from 'react';
import { type Device, useAuthState } from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

interface NetworkData {
	domainName: string;
	vendorName: string;
	username: string;
	password: string;
	internalAddress: string;
	externalAddress: string;
}


export const useAddLan = (onDone: () => void, close: () => void) => {
	const { getCompany } = useAuthState();
	const [fetcher, _, isLoading] = useFetcher();
	const [
		{
			domainName,
			vendorName,
			username,
			password,
			internalAddress,
			externalAddress,
		},
		setNetworkData,
	] = useState<NetworkData>({
		domainName: '',
		vendorName: '',
		username: '',
		password: '',
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
			if (data.error == 1) {
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
			device_name: domainName,
			device_version: vendorName,
			access_username: username,
			access_password: password,
			device_in_address: internalAddress,
			device_ex_address: externalAddress,
		};
		fetchOne(requestParams, companyID);
	};

	const validators = () => {
		if (!domainName.trim() || domainName.length == 0) {
			toast.error('Invalid host name');
			return true;
		}

		if (!vendorName.trim()) {
			toast.error('Invalid vendor name');
			return true;
		}
		return false;
	};

	return {
		vendorName,
		internalAddress,
		externalAddress,
		isLoading,
		validators,
		refetch,
        setNetworkData
	};
};
