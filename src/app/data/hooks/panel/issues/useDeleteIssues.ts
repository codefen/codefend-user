import { useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';

export const useDeleteIssue = () => {
	const { getCompany } = useAuthState();
	const fetchDelete = (issueId: string, companyID: string) => {
		return IssueService.delete(issueId, companyID);
	};

	const handleDelete = (deletedIssueId: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchDelete(deletedIssueId, companyID)
			.then((response: any) => {
				if (response.response !== 'success')
					throw new Error(response.message);

				toast.success('Successfully deleted Issue...');
			})
			.catch((error: Error) => toast.error(error.message));
	};

	return { handleDelete };
};
