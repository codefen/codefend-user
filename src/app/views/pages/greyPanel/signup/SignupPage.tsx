import { useShowScreen } from '#commonHooks/useShowScreen';
import DashboardAssets from '@/app/components/DashboardAssets/DashboardAssets';
import { DashboardInvoke } from '@/app/components/DashboardInvoke/DashboardInvoke';
import { RightItemButton } from '@/app/components/RightItemButton/RightItemButton';
import { SignupForm } from '@/app/components/SignupForm/SignupForm';
import useAuthStore from '@stores/auth.store';
import { Navigate } from 'react-router';

const recoursesEmpty = {
  cloud: '0',
  lan: '0',
  mobile: '0',
  social: '0',
  source: '0',
  web: '0',
};

export const SignupPage = () => {
  const [showScreen] = useShowScreen();
  const { isAuth } = useAuthStore(state => state);
  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  return (
    <main className={`${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <SignupForm />
      <section className="left">
        <DashboardInvoke />
        <DashboardAssets resources={recoursesEmpty} />
      </section>
      <section className="right">
        <RightItemButton
          title="Add team members"
          description="Send us the first invitation"
          img="/codefend/add-collab.png"
        />
        <RightItemButton
          title="Add scope / attack surface"
          description="You can help us expand the scope."
          img="/codefend/add-scope.png"
        />
      </section>
    </main>
  );
};
