import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import type { ResourceCredential } from '@interfaces/creds';
import { useState } from 'react';

export const useViewCredentials = () => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const [credentials, setCredentials] = useState<ResourceCredential[]>([]);

	const getCredentials = (type: string, id: string) => {
		fetcher('post', {
			body: {
				model: 'creds/index',
				company_id: getCompany(),
				resource_class: type,
				resource_id: id,
			},
		}).then(({ data }: any) => {
			if (apiErrorValidation(data?.error, data?.response))
				throw new Error('');

			setCredentials(data.disponibles ? data.disponibles : []);
		});
	};

	return [credentials, { getCredentials, isLoading }] as const;
};
