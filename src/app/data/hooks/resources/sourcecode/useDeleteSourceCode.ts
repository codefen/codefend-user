import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export const useDeleteSourceCode = () => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);

	const fetDeleteResources = (id: string, companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/source',
				ac: 'del',
				id: id,
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				if (apiErrorValidation(data?.error, data?.response)) {
					throw new Error('An error has occurred on the server');
				}
				toast.success('Successfully deleted sourcecode resources...');
			})
			.catch(() => {
				toast.error('An error has occurred on the server');
			});
	};

	const deletedResource = (id: string) => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;

		return fetDeleteResources(id, companyID);
	};


	return {
		isDeleting: isLoading,
		deletedResource,
	};
};
