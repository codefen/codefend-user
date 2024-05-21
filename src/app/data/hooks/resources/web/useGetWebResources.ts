import { useState } from 'react';
import { verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import type { Webresource } from '@interfaces/panel';
import { useOrderStore } from '@stores/orders.store';
import { ResourcesTypes } from '@interfaces/order';

export const useGetWebResources = () => {
	const { getCompany, logout } = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);
	const { setScopeTotalResources, updateState } = useOrderStore((state) => state);
	const [webResources, setWebResources] = useState<Webresource[]>(
		[]
	);

	const refetch = (childs?: string) => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;

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

			const resources = data?.resources ? data.resources : [];
			setWebResources(resources);
			setScopeTotalResources(resources.length);
		}).finally(() => updateState('resourceType', ResourcesTypes.WEB));
	};

	return { webResources, isLoading, refetch };
};