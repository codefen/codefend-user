import { useShowScreen } from '#commonHooks/useShowScreen';
import { Navigate, Outlet } from 'react-router';
import { Suspense, useEffect } from 'react';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke';
import { DashboardAddResource } from '../panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource';
import { DashboardAddCollaborators } from '../panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators';
import { VulnerabilitiesStatus } from '../../components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '../../components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '../../components/DashboardScanStart/DashboardScanStart';
import { Sidebar } from '../../components';
import { EMPTY_GLOBAL_STATE } from '@/app/constants/empty';
import { useUserData } from '#commonUserHooks/useUserData';

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
  const { isAuth } = useUserData();

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
          <DashboardInvoke scanNumber={0} disponibles={1} />
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
