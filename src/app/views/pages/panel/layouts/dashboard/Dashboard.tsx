import DashboardVulnerabilities from './components/DashboardVulnerabilities.tsx';

import { useDashboard } from '@panelHooks/dashboard/useDashboard.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';
import './dashboard.scss';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke.tsx';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';
import { DashboardAddResource } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource.tsx';
import { DashboardAddCollaborators } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators.tsx';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart.tsx';
import { useEffect } from 'react';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel.ts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider.tsx';
import { SectionTracker } from '@/app/views/components/telemetry/SectionTracker';
import Navbar from '@/app/views/components/navbar/Navbar';
import { CardSkeleton } from '@/app/views/components/CardSkeleton/CardSkeleton.tsx';
import { useMediaQuery } from 'usehooks-ts';

const Dashboard = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { isLoading, data, isScanning, company } = useDashboard();
  const { appEvent, userLoggingState, scaningProgress, currentScan, lastScanId } =
    useGlobalFastFields([
      'appEvent',
      'userLoggingState',
      'currentScan',
      'scaningProgress',
      'lastScanId',
    ]);

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.DASHBOARD_PAGE_CONDITION);
    }
  }, []);

  useEffect(() => {
    document.title = 'Codefend: Dashboard';
  }, []);

  const openScan = () => {
    if (isScanning.get) {
      currentScan.set(null);
      lastScanId.set(Math.max(...(scaningProgress.get?.keys() || [])).toString());
    }
  };

  return (
    <SectionTracker sectionName="dashboard">
      <main
        className={`dashboard ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
        {/* <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div> */}

        <section className="left">
          <DashboardScanStart />
          {!isScanning.get &&
          (Number(company.get?.disponibles_neuroscan) <= 0 || data?.issues?.length > 0) ? (
            <DashboardVulnerabilities
              isLoading={isLoading}
              topVulnerabilities={data?.issues || []}
            />
          ) : !isLoading ? (
            <DashboardInvoke isScanning={isScanning.get} openScan={openScan} />
          ) : (
            <CardSkeleton />
          )}
          <div className="box-assets">
            <DashboardAddResource data={data} isLoading={isLoading} />
            <DashboardAddCollaborators isLoading={isLoading} data={data} />
          </div>
        </section>

        <section className="right">
          {/* <Navbar /> */}
          <DashboardScanStart />
          <VulnerabilitiesStatus
            isLoading={isLoading}
            vulnerabilityByShare={data?.issues_condicion || {}}
          />
          <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
        </section>
      </main>
    </SectionTracker>
  );
};

export default Dashboard;
