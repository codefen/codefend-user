import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export const useDeleteWebResource = () => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();

	const handleDelete = async (
		onDone: () => void | null,
		id: string,
	): Promise<any> => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;
		fetcher<any>('post', {
			body: {
				model: 'resources/web/del',
				resource_id: id,
				company_id: companyID,
			},
		})
			.then(({ data }) => {
				if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
					throw new Error('An error has occurred on the server');
				}

				toast.success('Successfully deleted Web resource...');
				if (onDone && onDone !== undefined) onDone();
			})
			.catch((error: any) => {
				toast.error(error.message);
				close?.();
			});
	};

	return { handleDelete, isDeletingResource: isLoading };
};