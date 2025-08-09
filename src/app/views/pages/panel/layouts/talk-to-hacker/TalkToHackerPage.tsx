import { useShowScreen } from '#commonHooks/useShowScreen';
import { NewQuestHacker } from './components/newQuestHacker';
import { TalkHackerScreen } from './components/TalkHackerScreen/talkHackerScreen';
import { TaskHacker } from './components/taskHacker';
import './talktohacker.scss';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

export const TalkToHackerPage = () => {
  const [showScreen, refresh] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  return (
    <main className={`talk-to-hacker ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left">
        {/* Cards móviles - se muestran solo en móvil */}
        <div className="mobile-cards">
          {/* Card de "New question" */}
          <NewQuestHacker />
        </div>

        <TalkHackerScreen />

        {/* Tickets - se muestran solo en móvil */}
        <div className="mobile-bottom-card">
          <TaskHacker />
        </div>
      </section>
      <section className="right">
        <Navbar />
        <NewQuestHacker />
        <TaskHacker />
      </section>
    </main>
  );
};
