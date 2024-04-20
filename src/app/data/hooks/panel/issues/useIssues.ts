import { useCallback, useRef } from 'react';
import {
	type AllIssues,
	mapAllIssues,
	verifySession,
} from '../../../';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

/* Custom Hook "useOneIssue" to handle retrieval of all issues*/
export const useIssues = () => {
	const {  logout } = useUserData();
	const { getCompany} = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<AllIssues>();

	//Fetch to recover the issues
	const fetchAll = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'issues/index',
				company_id: companyID,
			},
		}).then(({ data }: any) => {
			verifySession(data, logout);
			dataRef.current = mapAllIssues(data);
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

	/* Utilities func*/
	const getIssues = (): AllIssues => {
		const issuesData = isLoading ? ({} as AllIssues) : dataRef.current;
		return issuesData || ({} as AllIssues);
	};

	return { getIssues, isLoading, refetchAll };
};
