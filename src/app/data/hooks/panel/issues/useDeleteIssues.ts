import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, ISSUE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

/* Custom Hook "useDeleteIssue" to handle the "deletion" of an issue */
export const useDeleteIssue = () => {
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();

  //Fetch func
  const fetchDelete = (issueId: string, companyID: string) => {
    return fetcher('post', {
      body: {
        model: 'issues/del',
        company_id: companyID,
        id: issueId,
      },
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data?.error, data?.response))
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);

        toast.success(ISSUE_PANEL_TEXT.DELETED_ISSUE);
      })
      .catch((error: Error) => toast.error(error.message));
  };

  //refetch func
  const refetch = (deletedIssueId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    return fetchDelete(deletedIssueId, companyID);
  };

  return { handleDelete: refetch };
};
