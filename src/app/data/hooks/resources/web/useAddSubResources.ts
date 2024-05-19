import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, isNotEmpty } from '@/app/constants/validations';

export const useAddSubResource = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const [domainName, setDomainName] = useState('');
	const [mainDomainId, setMainDomainId] = useState('');

	const verifyDomainName = () => {
		if (!isNotEmpty(mainDomainId)) {
			toast.error('Invalid main resource');
			return true;
		}

		if (!isNotEmpty(domainName)) {
			toast.error('Invalid domain');
			return true;
		}

		return false;
	};

	const handleAddSubResource = () => {
		if (!domainName) return;
		if (verifyDomainName()) return;

		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;

		fetcher<any>('post', {
			body: {
				model: 'resources/web/add/child',
				company_id: companyID,
				resource_domain_dad: mainDomainId,
				resource_address_domain: domainName,
			},
		}).then(({ data }) => {
			if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}

				setDomainName('');
				onDone();
				toast.success('Successfully Added Domain..');
			})
			.catch((error: any) => {
				toast.error(error.message);
				onClose();
			});
	};

	return {
		handleAddSubResource,
		isAddingSubDomain: isLoading,
		setDomainName,
		setMainDomainId,
		mainDomainId
	};
};