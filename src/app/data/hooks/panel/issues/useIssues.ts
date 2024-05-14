import { useCallback, useRef } from 'react';
import {
	type AllIssues,
	mapAllIssues,
	verifySession,
	type IssuesUtils,
	type Issues,
	mapIssues,
	mapIssuesCondition,
	mapIssueShare,
} from '../../../';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

/* Custom Hook "useOneIssue" to handle retrieval of all issues*/
export const useIssues = () => {
	const {  logout } = useUserData();
	const { getCompany} = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<Issues[]>([]);
	const otherInfo = useRef<IssuesUtils>();

	//Fetch to recover the issues
	const fetchAll = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'issues/index',
				company_id: companyID,
			},
		}).then(({ data }: any) => {
			if(verifySession(data, logout)) return;
			dataRef.current = data.issues
			? data.issues.map((issue: any) => mapIssues(issue))
			: [];
			otherInfo.current = {
				issueClass: data.issues_class,
				issueShare: mapIssueShare(data),
				issueCondition: mapIssuesCondition(data)
			};
		});
	}, []);

	//Refetch func, calls that calls fetcher
	const refetchAll = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchAll(companyID);
	};

	return { issues: dataRef.current, others: otherInfo.current, isLoading, refetchAll };
};
