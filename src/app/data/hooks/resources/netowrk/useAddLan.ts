import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, NETWORK_PANEL_TEXT } from '@/app/constants/app-toast-texts';

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
					? NETWORK_PANEL_TEXT.INVALID_LAN_IN_ADDRESS
					: data.info.includes('device_ex_address')
						? NETWORK_PANEL_TEXT.INVALID_LAN_EX_ADDRESS
						: APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR;

				toast.error(message);
				return;
			}
			toast.success(NETWORK_PANEL_TEXT.ADD_LAN);

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
