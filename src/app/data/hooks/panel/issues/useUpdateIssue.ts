import { useState } from 'react';
import { toast } from 'react-toastify';
import { getTinyEditorContent } from '../../../../../editor-lib';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { IssuesStatus } from '@interfaces/issues';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, ISSUE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export interface UpdateIssue {
  id: string;
  issueName: string;
  score: string;
  resourceID: number | undefined;
  status: IssuesStatus;
}

const validateNewIssue = (validate: boolean, message: string) => {
  if (validate) {
    toast.error(message);
    return false;
  }
  return true;
};

/* Custom Hook "useUpdateIssue" to handle updating an issue*/
export const useUpdateIssue = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const [updatedIssue, dispatch] = useState<UpdateIssue>({
    id: '',
    issueName: '',
    score: '',
    resourceID: 1,
    status: IssuesStatus.OPEN,
  });

  const fetchSave = (companyID: string) => {
    const _editorContent = getTinyEditorContent('issue');
    if (
      !validateNewIssue(
        !_editorContent.trim(),
        'Invalid content, please add content using the editor'
      )
    ) {
      return;
    }

    return fetcher('post', {
      body: {
        company_id: companyID,
        id: updatedIssue.id,
        main_desc: _editorContent,
        name: updatedIssue.issueName,
        resource_id: updatedIssue.resourceID || 1,
        risk_score: updatedIssue.score,
        condicion: updatedIssue.status,
      },
      path: 'issues/mod',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data))
          throw new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);

        toast.success(ISSUE_PANEL_TEXT.UPDATED_ISSUE);
        return { updatedIssue };
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  const update = async () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    return fetchSave(companyID);
  };

  return { updatedIssue, isAddingIssue: isLoading, dispatch, update };
};
