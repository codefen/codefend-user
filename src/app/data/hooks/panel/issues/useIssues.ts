import { useCallback, useRef, useState } from 'react';
import {
	type AllIssues,
	type FetchPattern,
	mapAllIssues,
	useAuthState,
	verifySession,
} from '../../../';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

/* Custom Hook "useOneIssue" to handle retrieval of all issues*/
export const useIssues = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
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
