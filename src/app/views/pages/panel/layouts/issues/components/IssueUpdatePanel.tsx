import { type FC, useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { PageLoader, PageLoaderOverlay } from '@defaults/loaders/Loader.tsx';
import { type UpdateIssue, useUpdateIssue } from '@panelHooks/issues/useUpdateIssue.ts';
import AppEditor from './AppEditor.tsx';
import Show from '@/app/components/Show/Show.tsx';
import type { IssueUpdateData } from '@interfaces/issues.ts';
import useTimeout from '#commonHooks/useTimeout.ts';
import IssueHeader from './IssueHeader.tsx';
import IssueInfo from './IssueInfo.tsx';
import useLoadIframe from '@panelHooks/issues/useLoadIframe.ts';
import { useTheme } from '@/app/views/context/ThemeContext.tsx';

interface IssueUpdatePanelProps {
  issueData: IssueUpdateData;
  isLoading: boolean;
}

const IssueUpdatePanel: FC<IssueUpdatePanelProps> = ({ issueData, isLoading }) => {
  const navigate = useNavigate();
  const [isEditable, setEditable] = useState(false);
  const { updatedIssue, isAddingIssue, dispatch, update } = useUpdateIssue();
  const { oneExecute, clear } = useTimeout(() => setEditable(true), 380);
  const { theme } = useTheme();

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

  useEffect(() => {
    const iframe = document.getElementById('issue_ifr') as HTMLIFrameElement | null;
    if (!iframe) return;

    const updateIframeTheme = () => {
      const doc = iframe.contentDocument;
      if (doc) {
        doc.documentElement.setAttribute('data-theme', theme);
        doc.body.setAttribute('data-theme', theme);
      }
    };

    // Si el documento ya está listo, actualizamos inmediatamente
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      updateIframeTheme();
      return () => {};
    } else {
      iframe.addEventListener('load', updateIframeTheme);
      return () => iframe.removeEventListener('load', updateIframeTheme);
    }
  }, [isLoaded, theme, isEditable, isLoading]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name == 'resourceID' && (!value || isNaN(Number(value)))) return;

    dispatch(state => ({
      ...state,
      [name]: name == 'resourceID' ? value.replace(/[^0-9]/g, '') : value,
    }));
  };

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
      <div>
        <AppEditor
          isEditable={!isEditable}
          isLoaded={!isLoading && isLoaded}
          initialValue={issueData.issue}
          isCreation={false}
        />
      </div>
      <Show when={isAddingIssue}>
        <PageLoaderOverlay />
      </Show>
    </>
  );
};

export default IssueUpdatePanel;
