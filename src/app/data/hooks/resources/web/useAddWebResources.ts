import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull, isNotEmpty } from '@/app/constants/validations';

export const useAddWebResourcce = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const [domainName, setDomainName] = useState('');

	const verifyDomainName = () => {
		if (!isNotEmpty(domainName)) {
			toast.error('Invalid domain');
			return true;
		}
		return false;
	};

	const handleAddResource = () => {
		if (verifyDomainName()) return;

		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;

		fetcher<any>('post', {
			body: {
				model: 'resources/web/add',
				company_id: companyID,
				resource_address_domain: domainName,
			},
			timeout: 80000
		})
            .then(({ data }) => {
				if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
					throw new Error('An error has occurred on the server');
				}
				setDomainName('');
				toast.success('Successfully Added Domain..');
				onDone();
			})
			.catch((error: any) => {
				toast.error(error.message);
				onClose();
			});
	};

	return { handleAddResource, isAddingDomain: isLoading, setDomainName };
};