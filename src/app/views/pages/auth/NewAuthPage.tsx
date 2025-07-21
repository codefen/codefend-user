import { useShowScreen } from '#commonHooks/useShowScreen';
import { Navigate, Outlet } from 'react-router';
import { Suspense, useEffect } from 'react';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke';
import { DashboardAddResource } from '../panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource';
import { EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE } from '@/app/constants/empty';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { Sidebar } from '@/app/views/components';
import { DashboardAddCollaborators } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart';
import { useMediaQuery } from 'usehooks-ts';

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
  const matches = useMediaQuery('(max-width: 980px)');

  if (isAuth) {
    return <Navigate to={'/'} />;
  }
  return (
    <main className={`auth-pages ${showScreen ? 'actived' : ''}`}>
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
};
