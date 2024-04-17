import { useCallback, useRef, useState } from 'react';
import { type Device, useAuthState } from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';


export const useAddLanV2 = (onDone: () => void, close: () => void) => {
	const { getCompany } = useAuthState();
	const [fetcher, _, isLoading] = useFetcher();
	const [
		{
			mainDomainId,
			domainName,
			vendorName,
			internalIpAddress,
			externalIpAddress,
		},
		setFormData,
	] = useState({
		domainName: '',
		vendorName: '',
		mainDomainId: 0,
		internalIpAddress: '',
		externalIpAddress: '',
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
		})
			.then(({ data }: any) => {
				toast.success('successfully added Sub Network...');
			})
			.finally(() => {
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
		const requestBody = {
			device_name: domainName,
			device_os: vendorName,
			device_in_address: internalIpAddress,
			device_ex_address: externalIpAddress,
			resource_lan_dad: mainDomainId,
		};
		fetchOne(requestBody, companyID);
	};

	const validators = () => {
		console.log({mainDomainId});
		if (!mainDomainId || mainDomainId === 0) {
			toast.error('Invalid main resource');
			return true;
		}

		if (!domainName.trim() || domainName.length == 0) {
			toast.error('Invalid host name');
			return true;
		}
		return false;
	};

	return {
		mainDomainId,
		vendorName,
		isLoading,
		validators,
		refetch,
		setFormData,
	};
};
