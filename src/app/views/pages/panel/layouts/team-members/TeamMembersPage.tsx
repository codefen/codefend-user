import { useShowScreen } from '#commonHooks/useShowScreen';

export const TeamMembersPage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  return (
    <main className={`talk-to-hacker ${showScreen ? 'actived' : ''}`}>
      <h1>Talk to a hacker</h1>
    </main>
  );
};
