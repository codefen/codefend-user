import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import type { IssueUpdateData } from '@interfaces/issues';
import { EMPTY_ISSUEUPDATE } from '@/app/constants/empty';
import { verifySession } from '@/app/constants/validations';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

/* Custom Hook "useOneIssue" to handle single issue retrieval*/
export const useOneIssue = () => {
	const {  updateUserData, updateToken } = useUserData();
	const { getCompany,logout } = useUserData();
	const navigate = useNavigate();
	const [fetcher,_, isLoading] = useFetcher();
	const issue = useRef<IssueUpdateData>(EMPTY_ISSUEUPDATE);

	const fetchOne = (companyID: string, selectedID: string) => {
		fetcher("post",{
			body: {
				model: 'issues/view',
				issue_id: selectedID,
				company_id: companyID,
			}
		}).then(({data}: any) =>
				{
					if(verifySession(data, logout)) return;
					if(apiErrorValidation(data?.error, data?.response)){
						throw new Error(data.info || "");
					}
					issue.current = data.issue ? data.issue : EMPTY_ISSUEUPDATE;

					updateUserData(data.user);
					updateToken(data.session);
				}
			)
			.catch((error) => {
				//"The issue you are trying to view does not exist"
				if(String(error.message || "").startsWith("invalid or expired")){
					return;
				}
				toast.error(error.message || "An unexpected error has occurred on the server");
				navigate("/issues");
			});
	};

	const refetchOne = (selectedID: string) => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		fetchOne(companyID, selectedID);
	};

	return { getIssue: issue.current, isLoading, refetchOne };
};
