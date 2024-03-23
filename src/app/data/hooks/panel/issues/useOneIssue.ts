import { useCallback, useState } from 'react';
import { type FetchPattern, type OneIssue, mapLoginResponseToUser, mapOneIssue, useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

/* Custom Hook "useOneIssue" to handle single issue retrieval*/
export const useOneIssue = () => {
	const { getCompany, updateUserData, updateToken } = useAuthState();
	const navigate = useNavigate();
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
			.then((res: any) =>
				{
					if(res.response === "error"){
						throw new Error("The issue you are trying to view does not exist");
					}
					dispatch({
						data: mapOneIssue(res),
						error: null,
						isLoading: false,
					})

					updateUserData(mapLoginResponseToUser(res.user));
					updateToken(res.session);
				}
			)
			.catch((error) => {
				dispatch({ data: null, error, isLoading: false });
				toast.error(error.message ?? "An unexpected error has occurred on the server");
				navigate("/issues");
			});
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
