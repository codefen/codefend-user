import { useShowScreen } from '#commonHooks/useShowScreen';
import { NewQuestHacker } from './components/newQuestHacker';
import { TalkHackerScreen } from './components/TalkHackerScreen/talkHackerScreen';
import { TaskHacker } from './components/taskHacker';
import './talktohacker.scss';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';
import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { AskQuestionOutlineIcon } from '@icons';

export const TalkToHackerPage = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  return (
    <PanelInterior
      title="Ask a hacker"
      titleIcon={<AskQuestionOutlineIcon />}
      ready={showScreen}
      className={`talk-to-hacker ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left">
        <div className="mobile-cards">
          <div className="card">
            <NewQuestHacker />
          </div>
        </div>

        <div className="card talk-hacker-main">
          <TalkHackerScreen />
        </div>

        <div className="mobile-bottom-card">
          <div className="card">
            <TaskHacker />
          </div>
        </div>
      </section>
      <section className="right">
        <Navbar />
        <div className="card">
          <NewQuestHacker />
        </div>
        <div className="card">
          <TaskHacker />
        </div>
      </section>
    </PanelInterior>
  );
};
