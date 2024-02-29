import { useCallback, useState } from 'react';
import { FetchPattern, OneIssue, mapLoginResponseToUser, mapOneIssue, useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';

/* Custom Hook "useOneIssue" to handle single issue retrieval*/
export const useOneIssue = () => {
	const { getCompany, updateUserData, updateToken } = useAuthState();
	const [{ data, isLoading }, dispatch] = useState<
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
				{
					dispatch({
						data: mapOneIssue(response),
						error: null,
						isLoading: false,
					})

					updateUserData(mapLoginResponseToUser(response.user));
					updateToken(response.session);
				}
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	}, []);

	const refetchOne = (selectedID: string) => {
		const companyID = getCompany();
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
