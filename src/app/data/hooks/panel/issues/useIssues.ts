import { useCallback, useState } from 'react';
import { type AllIssues, type FetchPattern, mapAllIssues, useAuthState, verifySession } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';

/* Custom Hook "useOneIssue" to handle retrieval of all issues*/
export const useIssues = () => {
	const { getCompany, logout } = useAuthState();
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<AllIssues>>({
		data: null,
		error: null,
		isLoading: false,
	});
	
	//Fetch to recover the issues
	const fetcher = useCallback((companyID: string) => {
		dispatch((state: any) => ({
			...state,
			isLoading: true,
		}));
		IssueService.getAll(companyID)
			.then((response: any) =>
				{
					verifySession(response, logout);
					
					dispatch({
						data: mapAllIssues(response),
						error: null,
						isLoading: false,
					})
				}
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	}, []);

	//Refetch func, calls that calls fetcher
	const refetchAll = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetcher(companyID);
	};

	/* Utilities func*/
	const getIssues = (): AllIssues => {
		const issuesData = isLoading ? ({} as AllIssues) : data;
		return issuesData ?? ({} as AllIssues);
	};

	return { getIssues, isLoading, refetchAll };
};
