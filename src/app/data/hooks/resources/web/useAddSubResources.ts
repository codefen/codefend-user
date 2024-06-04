import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import {
	apiErrorValidation,
	companyIdIsNull,
	isNotEmpty,
} from '@/app/constants/validations';
import {
	APP_MESSAGE_TOAST,
	WEB_PANEL_TEXT,
} from '@/app/constants/app-toast-texts';

const verifyDomainName = (mainDomainId: string, domainName: string) => {
	if (!isNotEmpty(mainDomainId)) {
		toast.error(WEB_PANEL_TEXT.INVALID_DAD_DOMAIN);
		return true;
	}

	if (!isNotEmpty(domainName)) {
		toast.error(WEB_PANEL_TEXT.INVALID_SUB_DOMAIN);
		return true;
	}

	return false;
};

export const useAddSubResource = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const domainName = useRef<HTMLInputElement>(null);
	const mainDomainId = useRef<HTMLSelectElement>(null);

	const handleAddSubResource = () => {
		const companyID = getCompany();
		const subDomain = domainName.current?.value || '';
		const domainId = mainDomainId.current?.value || '';
		if (companyIdIsNull(companyID) || verifyDomainName(domainId, subDomain))
			return;
		const toastId = toast.loading(WEB_PANEL_TEXT.SAVING_SUB_DOMAIN, {
			closeOnClick: true,
		});
		onClose();
		fetcher<any>('post', {
			body: {
				model: 'resources/web/add/child',
				company_id: companyID,
				resource_domain_dad: domainId,
				resource_address_domain: subDomain,
			},
		})
			.then(({ data }) => {
				toast.dismiss(toastId);
				if (
					data.isAnError ||
					apiErrorValidation(data?.error, data?.response)
				) {
					throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
				}

				onDone();
				toast.success(WEB_PANEL_TEXT.ADD_SUB_DOMAIN);
			})
			.catch((error: any) => {
				toast.error(error.message);
				
			});
	};

	return {
		handleAddSubResource,
		isLoading,
		domainName,
		mainDomainId,
	};
};
