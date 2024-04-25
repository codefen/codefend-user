import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import type { ResourceCredential } from '@interfaces/creds';
import { useState } from 'react';
import { toast } from 'react-toastify';

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
			if (data.error != '0' || data.response == 'error') throw new Error('');

			setCredentials(data.disponibles ? data.disponibles : []);
		});
	};

	return [credentials, { getCredentials, isLoading }] as const;
};
