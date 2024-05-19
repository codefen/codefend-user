import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, isNotEmpty } from '@/app/constants/validations';

const verifyDomainName = (mainDomainId:string, domainName: string) => {
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

export const useAddSubResource = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const domainName = useRef<HTMLInputElement>(null);
	const mainDomainId = useRef<HTMLSelectElement>(null);

	const handleAddSubResource = () => {
		const companyID = getCompany();
		const subDomain = domainName.current?.value || "";
		const domainId = mainDomainId.current?.value || "";
		if (companyIdIsNull(companyID) || verifyDomainName(domainId,subDomain)) return;

		fetcher<any>('post', {
			body: {
				model: 'resources/web/add/child',
				company_id: companyID,
				resource_domain_dad: domainId,
				resource_address_domain: subDomain,
			},
		}).then(({ data }) => {
			if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}

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
		isLoading,
		domainName,
		mainDomainId
	};
};