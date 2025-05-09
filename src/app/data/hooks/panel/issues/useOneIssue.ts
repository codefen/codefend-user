import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import type { IssueUpdateData } from '@interfaces/issues';
import { EMPTY_ISSUEUPDATE } from '@/app/constants/empty';
import { verifySession } from '@/app/constants/validations';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

/* Custom Hook "useOneIssue" to handle single issue retrieval*/
export const useOneIssue = () => {
  const { getCompany, logout } = useUserData();
  const navigate = useNavigate();
  const [fetcher, _, isLoading] = useFetcher();
  const issue = useRef<IssueUpdateData>(EMPTY_ISSUEUPDATE);
  const { updateState } = useOrderStore();
  const { company, session, user } = useGlobalFastFields(['company', 'session', 'user']);

  const fetchOne = (companyID: string, selectedID: string) => {
    fetcher('post', {
      body: {
        issue_id: selectedID,
        company_id: companyID,
      },
      path: 'issues/view',
      insecure: true,
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (apiErrorValidation(data)) {
          const customError: any = new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
          customError.code = data?.error_info || 'generic';
          throw customError;
        }
        issue.current = data.issue ? data.issue : EMPTY_ISSUEUPDATE;
        if (data?.company) company.set(data.company);
        if (data?.user) user.set(data.user);
        if (data?.session) session.set(data.session);
      })
      .catch(error => {
        //"The issue you are trying to view does not exist"
        if (String(error.message || '').startsWith('invalid or expired')) {
          return;
        }
        switch (error.code) {
          case 'issue_not_found':
            toast.error('La incidencia no existe.');
            break;
          case 'issues_maximum_reached':
            updateState('open', true);
            updateState('orderStepActive', OrderSection.PAYWALL);
            updateState('resourceType', ResourcesTypes.WEB);
            break;
          default:
            toast.error(error.message || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }

        navigate('/issues');
      });
  };

  const refetchOne = (selectedID: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchOne(companyID, selectedID);
  };

  return { getIssue: issue.current, isLoading, refetchOne };
};
