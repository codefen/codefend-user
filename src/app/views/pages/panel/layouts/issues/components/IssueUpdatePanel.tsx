import { type FC, useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { PageLoader, PageLoaderOverlay } from '@/app/views/components/loaders/Loader.tsx';
import { type UpdateIssue, useUpdateIssue } from '@panelHooks/issues/useUpdateIssue.ts';
import AppEditor from './AppEditor.tsx';
import Show from '@/app/views/components/Show/Show.tsx';
import type { IssueUpdateData } from '@interfaces/issues.ts';
import useTimeout from '#commonHooks/useTimeout.ts';
import IssueHeader from './IssueHeader.tsx';
import IssueInfo from './IssueInfo.tsx';
import useLoadIframe from '@panelHooks/issues/useLoadIframe.ts';
import { useTheme } from '@/app/views/context/ThemeContext.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';

interface IssueUpdatePanelProps {
  issueData: IssueUpdateData;
  isLoading: boolean;
}

const IssueUpdatePanel: FC<IssueUpdatePanelProps> = ({ issueData, isLoading }) => {
  const navigate = useNavigate();
  const [isEditable, setEditable] = useState(false);
  const { updatedIssue, isAddingIssue, dispatch, update } = useUpdateIssue();
  const { oneExecute, clear } = useTimeout(() => setEditable(true), 380);

  const handleIssueUpdate = () => {
    update()
      .then((response: any) => {
        setEditable(false);
      })
      .finally(() => {
        navigate(`/issues`);
      });
  };
  const [isLoaded, loadIframe] = useLoadIframe(handleIssueUpdate);
  const { isAdmin, isProvider } = useUserRole();
  useEffect(() => {
    dispatch((state: UpdateIssue) => ({
      ...state,
      id: issueData.id,
      issueName: issueData.name || '',
      score: issueData.risk_score || '',
      resourceID: Number(issueData.resource_id || 1),
      status: issueData.condicion,
    }));
    if (isLoaded) {
      oneExecute();
      return clear;
    }
    let cleanup: () => void = () => {};

    loadIframe()
      .then(cleanupFn => {
        cleanup = cleanupFn;
      })
      .catch(error => {
        console.error(error);
      });
    return cleanup;
  }, [issueData, isLoaded]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name == 'resourceID' && (!value || isNaN(Number(value)))) return;

    dispatch(state => ({
      ...state,
      [name]: name == 'resourceID' ? value.replace(/[^0-9]/g, '') : value,
    }));
  };

  const isViewAndEdit = isAdmin() || isProvider();

  if (isLoading) return <PageLoader />;

  return (
    <>
      <IssueHeader
        isEditable={isEditable}
        issue={updatedIssue}
        isLoaded={!isLoading && isLoaded}
        changeEditable={() => setEditable(prev => !prev)}
        handleChange={handleChange}
        handleSend={handleIssueUpdate}
        isSave={false}
        showPencil={true}
      />
      <IssueInfo
        issueData={issueData}
        isEditable={isEditable}
        isLoaded={!isLoading && isLoaded}
        isChild={!!updatedIssue.resourceID && updatedIssue.resourceID !== 0}
        defaultScore={updatedIssue.score}
        changeScore={score => dispatch(state => ({ ...state, score }))}
        changeStatus={status => dispatch(state => ({ ...state, status }))}
      />
      <div className={`issues-report ${!isViewAndEdit ? 'view-only' : ''}`}>
        {isViewAndEdit ? (
          <AppEditor
            isEditable={!isEditable}
            isLoaded={!isLoading && isLoaded}
            initialValue={issueData.issue}
            isCreation={false}
          />
        ) : (
          <div
            className="issue-main-content"
            dangerouslySetInnerHTML={{
              __html: issueData.issue,
            }}></div>
        )}

        {/* <div
          className="issue-main-content"
          dangerouslySetInnerHTML={{
            __html: issueData.issue,
          }}></div> */}
      </div>
      <Show when={isAddingIssue}>
        <PageLoaderOverlay />
      </Show>
    </>
  );
};

export default IssueUpdatePanel;
