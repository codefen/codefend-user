import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import DashboardVulnerabilities from './components/DashboardVulnerabilities.tsx';

import { useDashboard } from '@panelHooks/dashboard/useDashboard.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';
import './dashboard.scss';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke.tsx';
import { DashboardAddResource } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource.tsx';
import { DashboardAddCollaborators } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators.tsx';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart.tsx';
import { useEffect, useState } from 'react';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel.ts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider.tsx';
import { SectionTracker } from '@/app/views/components/telemetry/SectionTracker';
import { CardSkeleton } from '@/app/views/components/CardSkeleton/CardSkeleton.tsx';
import { useMediaQuery } from 'usehooks-ts';
import { GridOutlineIcon } from '@icons';

const ENTRANCE_DURATION = 1450;

const Dashboard = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { isLoading, data, isScanning, company } = useDashboard();
  const [entranceComplete, setEntranceComplete] = useState(false);
  const ready = showScreen && !isLoading;
  const entering = ready && !entranceComplete && !reducedMotion;
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

  useEffect(() => {
    if (!ready || entranceComplete) return;
    if (reducedMotion) {
      setEntranceComplete(true);
      return;
    }
    const timeout = window.setTimeout(() => setEntranceComplete(true), ENTRANCE_DURATION);
    return () => window.clearTimeout(timeout);
  }, [ready, entranceComplete, reducedMotion]);

  const openScan = () => {
    if (isScanning.get) {
      currentScan.set(null);
      lastScanId.set(Math.max(...(scaningProgress.get?.keys() || [])).toString());
    }
  };

  return (
    <SectionTracker sectionName="dashboard">
      <PanelInterior
        title="Dashboard"
        titleIcon={<GridOutlineIcon />}
        ready={showScreen}
        contentReady={!isLoading}
        className={`dashboard ${!isDesktop ? 'sidebar-mobile-active' : ''} ${entering ? 'dashboard-entering' : ''}`}>
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
            <DashboardAddResource data={data} animateMetrics={entering} />
            <DashboardAddCollaborators isLoading={isLoading} data={data} />
          </div>
        </section>

        <section className="right">
          {/* <Navbar /> */}
          <DashboardScanStart />
          <VulnerabilitiesStatus
            isLoading={isLoading}
            vulnerabilityByShare={data?.issues_condicion || {}}
            animateMetrics={entering}
          />
          <VulnerabilityRisk
            vulnerabilityByRisk={data?.issues_share || {}}
            isLoading={isLoading}
            disableAnimation={reducedMotion}
          />
        </section>
      </PanelInterior>
    </SectionTracker>
  );
};

export default Dashboard;
