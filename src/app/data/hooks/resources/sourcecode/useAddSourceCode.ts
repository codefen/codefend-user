import { toast } from 'react-toastify';

import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export const useAddSourceCode = () => {
	const { getCompany} = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);

	const fetchAdd = (params: any, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'resources/source',
				ac: 'add',
				company_id: companyID,
				...params,
			},
		})
			.then(({ data }: any) => {
				if (apiErrorValidation(data?.error, data?.response)) {
					throw new Error('');
				}
				toast.success('Successfully repository is added');
			})
			.catch(() => {
				toast.error('An error has occurred on the server');
			});
	};

	const addSourceCode = (params: string) => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;

		return fetchAdd(params, companyID);
	};

	return {
		isLoading,
		addSourceCode,
	};
};
