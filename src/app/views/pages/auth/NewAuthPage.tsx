import { useShowScreen } from '#commonHooks/useShowScreen';
import { Navigate, Outlet } from 'react-router';
import { Suspense, useEffect } from 'react';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke';
import { DashboardAddResource } from '../panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource';
import { EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE } from '@/app/constants/empty';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { MoonIcon, Sidebar, SunIcon } from '@/app/views/components';
import { DashboardAddCollaborators } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart';
import { useMediaQuery } from 'usehooks-ts';
import { useTheme } from '@/app/views/context/ThemeContext';
import Show from '@/app/views/components/Show/Show';

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
  const { changeTheme, theme } = useTheme();

  if (isAuth) {
    return <Navigate to={'/'} />;
  }
  return (
    <main className={`auth-pages ${showScreen ? 'actived' : ''}`}>
      <button onClick={() => changeTheme()} className="theme-changer-button">
        <Show when={theme === 'dark'} fallback={<SunIcon width={1.75} height={1.75} />}>
          <MoonIcon width={1.75} height={1.75} />
        </Show>
      </button>
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
};
