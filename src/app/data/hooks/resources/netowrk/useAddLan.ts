import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useAddLan = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const desc = useRef<HTMLTextAreaElement>(null);
	const internalAddress = useRef<HTMLInputElement>(null);
	const externalAddress = useRef<HTMLInputElement>(null);

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
			if (apiErrorValidation(data?.error, data?.response)) {
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
		if (companyIdIsNull(companyID)) return;
		const requestParams = {
			device_desc: desc.current?.value || "",
			device_in_address: internalAddress.current?.value || "",
			device_ex_address: externalAddress.current?.value || "",
		};
		fetchOne(requestParams, companyID);
	};

	return {
		isLoading,
		refetch,
		internalAddress,
		externalAddress,
        desc,

	};
};
