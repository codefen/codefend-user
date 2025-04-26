import { useShowScreen } from '#commonHooks/useShowScreen';
import { UserProfileTop } from './components/userProfileTop';
import './userprofile.scss';
import { UserPassword } from './components/userPassword';
import { UserQr } from './components/userQr';

export const UserProfilePage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <UserProfileTop />
        <div className="box-assets">
          <UserPassword />
          <UserQr />
        </div>
      </section>
    </main>
  );
};
