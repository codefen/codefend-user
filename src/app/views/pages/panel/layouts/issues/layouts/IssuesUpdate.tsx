import { type FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { useOneIssue } from '@panelHooks/issues/useOneIssue.ts';
import { IssueChatDisplay } from '../components/IssueChatDisplay.tsx';
import IssueUpdatePanel from '../components/IssueUpdatePanel.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';

const IssueUpdate: FC = () => {
  const { getIssue, isLoading, refetchOne } = useOneIssue();
  const [showScreen, control, _refresh] = useShowScreen();
  const { id } = useParams();

  useEffect(() => {
    refetchOne(id as string);
    return () => {
      localStorage.removeItem('viewMessage');
    };
  }, [control]);

  return (
    <main className={`issue-detail ${showScreen ? 'actived' : ''}`}>
      <Show when={showScreen} fallback={<PageLoader />}>
        <>
          <section className="left">
            <IssueUpdatePanel issueData={getIssue} isLoading={isLoading} />
          </section>
          <section className="right">
            <IssueChatDisplay id={id || '0'} />
          </section>
        </>
      </Show>
    </main>
  );
};

export default IssueUpdate;
