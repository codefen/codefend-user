import { useShowScreen } from '#commonHooks/useShowScreen';
import useAuthStore from '@stores/auth.store';
import { Navigate, Outlet } from 'react-router';
import { Suspense } from 'react';
import { DashboardInvoke } from '@/app/views/components/DashboardInvoke/DashboardInvoke';
import DashboardAssets from '@/app/views/components/DashboardAssets/DashboardAssets';
import { RightItemButton } from '@/app/views/components/RightItemButton/RightItemButton';

const recoursesEmpty = {
  cloud: '0',
  lan: '0',
  mobile: '0',
  social: '0',
  source: '0',
  web: '0',
};

export const NewAuthPage = () => {
  const [showScreen] = useShowScreen();
  const { isAuth } = useAuthStore(state => state);
  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  return (
    <main className={`${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <Suspense>
        <Outlet />
      </Suspense>
      <section className="left">
        <DashboardInvoke />
        <DashboardAssets resources={recoursesEmpty} disabled={true} />
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
