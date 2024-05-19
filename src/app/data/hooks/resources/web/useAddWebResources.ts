import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, isNotEmpty } from '@/app/constants/validations';

const verifyDomainName = (domainName: string) => {
	if (!isNotEmpty(domainName)) {
		toast.error('Invalid domain');
		return true;
	}
	return false;
};

export const useAddWebResourcce = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const domainName = useRef<HTMLInputElement>(null);


	const handleAddResource = () => {
		if (verifyDomainName(domainName.current?.value || "")) return;

		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;

		fetcher<any>('post', {
			body: {
				model: 'resources/web/add',
				company_id: companyID,
				resource_address_domain: domainName.current?.value || "",
			},
			timeout: 180000
		})
            .then(({ data }) => {
				if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
					throw new Error('An error has occurred on the server');
				}
				toast.success('Successfully Added Domain..');
				onDone();
			})
			.catch((error: any) => {
				toast.error(error.message);
				onClose();
			});
	};

	return { handleAddResource, isLoading, domainName };
};