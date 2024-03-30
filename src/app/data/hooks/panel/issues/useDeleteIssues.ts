import { useAuthState } from '../../../';
import { toast } from 'react-toastify';
import { useFetcher } from '../../util/useFetcher';

/* Custom Hook "useDeleteIssue" to handle the "deletion" of an issue */
export const useDeleteIssue = () => {
	const { getCompany } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();

	//Fetch func
	const fetchDelete = (issueId: string, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'issues/del',
				company_id: companyID,
				id: issueId,
			},
		})
			.then(({data}: any) => {
				if (data.response !== 'success')
					throw new Error(data.message);

				toast.success('Successfully deleted Issue...');
			})
			.catch((error: Error) => toast.error(error.message));
	};

	//refetch func
	const refetch = (deletedIssueId: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchDelete(deletedIssueId, companyID);
	};

	return { handleDelete: refetch };
};
