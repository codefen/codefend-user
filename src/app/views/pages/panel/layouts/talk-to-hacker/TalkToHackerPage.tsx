import { useShowScreen } from '#commonHooks/useShowScreen';
import { NewQuestHacker } from './components/newQuestHacker';
import { TalkHackerScreen } from './components/TalkHackerScreen/talkHackerScreen';
import { TaskHacker } from './components/taskHacker';
import './talktohacker.scss';

export const TalkToHackerPage = () => {
  const [showScreen, refresh] = useShowScreen();
  return (
    <main className={`talk-to-hacker ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <TalkHackerScreen />
      </section>
      <section className="right">
        <NewQuestHacker />
        <TaskHacker />
      </section>
    </main>
  );
};
