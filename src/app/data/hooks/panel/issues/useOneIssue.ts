import { useCallback, useState } from 'react';
import { FetchPattern, OneIssue, mapOneIssue, useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';

export const useOneIssue = () => {
	const { getUserdata } = useAuthState();
	const [{ data, error, isLoading }, dispatch] = useState<
		FetchPattern<OneIssue>
	>({
		data: null,
		error: null,
		isLoading: false,
	});

	const fetchOne = useCallback((companyID: string, selectedID: string) => {
		dispatch((state: any) => ({
			...state,
			isLoading: true,
		}));
		IssueService.getOne(selectedID, companyID)
			.then((response: any) =>
				dispatch({
					data: mapOneIssue(response),
					error: null,
					isLoading: false,
				}),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	}, []);

	const refetchOne = (selectedID: string) => {
		const companyID = getUserdata()?.companyID;
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchOne(companyID, selectedID);
	};

	const getIssues = (): OneIssue => {
		const empty = { issue: null, company: null } as OneIssue;
		const issuesData = isLoading ? empty : data;
		return issuesData ?? empty;
	};

	return { getIssues, isLoading, refetchOne };
};
