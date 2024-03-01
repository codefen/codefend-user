import { useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';

/* Custom Hook "useDeleteIssue" to handle the "deletion" of an issue */
export const useDeleteIssue = () => {
	const { getCompany } = useAuthState();

	//Fetch func
	const fetcher = (issueId: string, companyID: string) => {
		return IssueService.delete(issueId, companyID);
	};

	//refetch func
	const refetch = (deletedIssueId: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetcher(deletedIssueId, companyID)
			.then((response: any) => {
				if (response.response !== 'success')
					throw new Error(response.message);

				toast.success('Successfully deleted Issue...');
			})
			.catch((error: Error) => toast.error(error.message));
	};

	return { handleDelete: refetch };
};
