import { useShowScreen } from '#commonHooks/useShowScreen';

export const UserProfilePage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''}`}>
      <h1>User Profile</h1>
    </main>
  );
};
