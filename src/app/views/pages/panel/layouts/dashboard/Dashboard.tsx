import DashboardVulnerabilities from './components/DashboardVulnerabilities.tsx';

import { useDashboard } from '@panelHooks/dashboard/useDashboard.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';
import './dashboard.scss';
import { DashboardInvoke } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardInvoke/DashboardInvoke.tsx';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';
import {
  useGlobalFastField,
  useGlobalFastFields,
} from '@/app/views/context/AppContextProvider.tsx';
import { DashboardAddResource } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddResource/DashboardAddResource.tsx';
import { DashboardAddCollaborators } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardAddCollaborators/DashboardAddCollaborators.tsx';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart.tsx';

const Dashboard = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data, isScanning, company } = useDashboard();

  return (
    <main className={`dashboard ${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>

      <section className="left">
        {!isScanning.get &&
        (Number(company.get?.disponibles_neuroscan) <= 0 || data?.issues?.length > 0) ? (
          <DashboardVulnerabilities isLoading={isLoading} topVulnerabilities={data?.issues || []} />
        ) : !isLoading ? (
          <DashboardInvoke isScanning={isScanning.get} />
        ) : (
          <PageLoader />
        )}
        <div className="content-box-assets left-asset">
          <div className="box-assets" style={{ flex: '0.7' }}>
            <DashboardAddResource data={data} />
          </div>
          <div className="box-assets">
            <DashboardAddCollaborators isLoading={isLoading} data={data} />
          </div>
        </div>
      </section>

      <section className="right">
        <VulnerabilitiesStatus vulnerabilityByShare={data?.issues_condicion || {}} />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
        <DashboardScanStart />
      </section>
    </main>
  );
};

export default Dashboard;
