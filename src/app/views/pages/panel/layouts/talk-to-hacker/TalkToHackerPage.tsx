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
        <TalkHackerScreen />
      </section>
      <section className="right">
        <Navbar />
        <NewQuestHacker />
        <TaskHacker />
      </section>
    </main>
  );
};
