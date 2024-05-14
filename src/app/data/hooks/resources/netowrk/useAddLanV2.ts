import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';


export const useAddLanV2 = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const [
		{
			mainDomainId,
			desc,
			internalIpAddress,
			externalIpAddress,
		},
		setFormData,
	] = useState({
		desc: '',
		mainDomainId: 0,
		internalIpAddress: '',
		externalIpAddress: '',
	});
	/* Fetch LAN  Apps */
	const fetchSaveChild = useCallback((params: any, companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/lan',
				ac: 'add',
				company_id: companyID,
				...params,
			},
		})
			.then(({ data }: any) => {
				if (apiErrorValidation(data?.error, data?.response)) {
					let message = data.info.includes('device_in_address')
						? 'Device internal address is invalid'
						: data.info.includes('device_ex_address')
							? 'device external address is invalid'
							: 'An unexpected error has occurred on the server';
	
					toast.error(message);
					return;
				}
				toast.success('successfully added Sub Network...');
					close();
					onDone();
			});
	}, []);

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;
		const requestBody = {
			device_desc: desc,
			device_in_address: internalIpAddress,
			device_ex_address: externalIpAddress,
			resource_lan_dad: mainDomainId,
		};
		fetchSaveChild(requestBody, companyID);
	};

	const validators = () => {
		if (!mainDomainId || mainDomainId === 0) {
			toast.error('Invalid main resource');
			return true;
		}
		return false;
	};

	return {
		mainDomainId,
		isLoading,
		validators,
		refetch,
		setFormData,
	};
};
