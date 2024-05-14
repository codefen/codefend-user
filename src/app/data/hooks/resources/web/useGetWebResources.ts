import { useState } from 'react';
import {
	type WebapplicationProps,
	mapToWebresourceProps,
	useOrderStore,
	verifySession,
	type Company,
	ResourcesTypes,
} from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export const useGetWebResources = () => {
	const { getCompany, logout } = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);
	const { setScopeTotalResources, updateState } = useOrderStore((state) => state);
	const [webResources, setWebResources] = useState<WebapplicationProps>(
		{company: {} as Company, resources: []}
	);

	const refetch = (childs?: string) => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;

		fetcher<any>('post', {
			body: {
				company_id: companyID,
				model: 'resources/web/index',
				childs: childs? childs:'yes',
				resource_address_domain: 'clarin.com',
			},
		}).then(({ data }) => {
			if(verifySession(data, logout)) return;
			if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}

			const webResource = mapToWebresourceProps(data);
			setWebResources(webResource);
			setScopeTotalResources(webResource.resources.length);
		}).finally(() => updateState('resourceType', ResourcesTypes.WEB));
	};

	return { webResources, isLoading, refetch };
};