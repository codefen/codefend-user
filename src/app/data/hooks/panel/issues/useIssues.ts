import { useCallback, useState } from 'react';
import { AllIssues, FetchPattern, mapAllIssues, useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';

export const useIssues = () => {
	const { getCompany } = useAuthState();
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<AllIssues>>({
		data: null,
		error: null,
		isLoading: false,
	});

	const fetchAll = useCallback((companyID: string) => {
		dispatch((state: any) => ({
			...state,
			isLoading: true,
		}));
		IssueService.getAll(companyID)
			.then((response: any) =>
				dispatch({
					data: mapAllIssues(response),
					error: null,
					isLoading: false,
				}),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	}, []);

	const refetchAll = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchAll(companyID);
	};

	const getIssues = (): AllIssues => {
		const issuesData = isLoading ? ({} as AllIssues) : data;
		return issuesData ?? ({} as AllIssues);
	};

	return { getIssues, isLoading, refetchAll };
};
