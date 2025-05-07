import { useShowScreen } from '#commonHooks/useShowScreen';
import useAuthStore from '@stores/auth.store';
import { Navigate, Outlet } from 'react-router';
import { Suspense, useEffect } from 'react';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke';
import DashboardAssets from '@/app/views/components/DashboardAssets/DashboardAssets';
import { RightItemButton } from '@/app/views/components/RightItemButton/RightItemButton';
import { DashboardAddResource } from '../panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource';
import { DashboardAddCollaborators } from '../panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators';
import { VulnerabilitiesStatus } from '../../components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '../../components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '../../components/DashboardScanStart/DashboardScanStart';
import { Sidebar } from '../../components';
import { EMPTY_GLOBAL_STATE } from '@/app/constants/empty';

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

  useEffect(() => {
    if (!isAuth) {
      localStorage.setItem('globalStore', JSON.stringify(EMPTY_GLOBAL_STATE));
    }
  }, [isAuth]);

  if (isAuth) {
    return <Navigate to={'/'} />;
  }
  return (
    <>
      <Sidebar />
      <main className={`${showScreen ? 'actived' : ''}`}>
        <div className="brightness variant-1"></div>
        <div className="brightness variant-2"></div>
        <Suspense>
          <Outlet />
        </Suspense>
        <section className="left">
          <DashboardInvoke />
          <section className="box-assets">
            <DashboardAddResource data={{}} />
          </section>
          <section className="box-assets">
            <DashboardAddCollaborators isLoading={false} data={{} as any} />
          </section>
        </section>

        <section className="right">
          <VulnerabilitiesStatus vulnerabilityByShare={{} as any} />
          <VulnerabilityRisk vulnerabilityByRisk={{} as any} isLoading={false} />
          <DashboardScanStart />
        </section>
      </main>
    </>
  );
};
