import { useCallback, useRef } from 'react';
import { type IssuesUtils, type Issues } from '@interfaces/panel';
import { mapIssues, mapIssuesCondition, mapIssueShare } from '@utils/mapper';
import { companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

/* Custom Hook "useOneIssue" to handle retrieval of all issues*/
export const useIssues = () => {
  const { logout } = useUserData();
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const dataRef = useRef<Issues[]>([]);
  const otherInfo = useRef<IssuesUtils>();

  //Fetch to recover the issues
  const fetchAll = useCallback((companyID: string) => {
    fetcher('post', {
      body: {
        company_id: companyID,
      },
      path: 'issues/index',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      dataRef.current = data.issues ? data.issues.map((issue: any) => mapIssues(issue)) : [];
      otherInfo.current = {
        issueClass: data.issues_class,
        issueShare: mapIssueShare(data),
        issueCondition: mapIssuesCondition(data),
      };
    });
  }, []);

  //Refetch func, calls that calls fetcher
  const refetchAll = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchAll(companyID);
  };

  return { issues: dataRef.current, others: otherInfo.current, isLoading, refetchAll };
};
