import { useCallback, useRef } from 'react';
import { type OneIssue, mapOneIssue } from '../../../';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

/* Custom Hook "useOneIssue" to handle single issue retrieval*/
export const useOneIssue = () => {
	const {  updateUserData, updateToken } = useUserData();
	const { getCompany } = useUserData();
	const navigate = useNavigate();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<OneIssue>();

	const fetchOne = useCallback((companyID: string, selectedID: string) => {
		fetcher("post",{
			body: {
				model: 'issues/view',
				issue_id: selectedID,
				company_id: companyID,
			}
		}).then(({data}: any) =>
				{
					if(data.response === "error"){
						throw new Error("The issue you are trying to view does not exist");
					}
					dataRef.current = mapOneIssue(data);

					updateUserData(data.user);
					updateToken(data.session);
				}
			)
			.catch((error) => {
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
		const issuesData = isLoading ? empty : dataRef.current;
		return issuesData || empty;
	};

	return { getIssues, isLoading, refetchOne };
};
