import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { type FC } from 'react';
import IssueCreationPanel from '../components/IssueCreationPanel';
import { IssueChatDisplay } from '../components/IssueChatDisplay';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';

const IssuesCreation: FC = () => {
  const [showScreen] = useShowScreen();

  return (
    <PanelInterior title="Create issue" ready={showScreen} className="issue-detail">
      <section className="left">
        <IssueCreationPanel isLoading={showScreen} />
      </section>
      <section className="right">
        <IssueChatDisplay id="0" />
      </section>
    </PanelInterior>
  );
};

export default IssuesCreation;
