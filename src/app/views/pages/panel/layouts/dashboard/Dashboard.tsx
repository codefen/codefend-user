import React, { useEffect } from 'react';

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

const Dashboard: React.FC = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const { company, scanNumber, isScanning } = useGlobalFastFields([
    'company',
    'scanNumber',
    'isScanning',
  ]);
  useEffect(() => {
    if (data?.company) {
      company.set(data.company);
    }
  }, [data?.company]);

  return (
    <main className={`dashboard ${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>

      <section className="left">
        {scanNumber.get > 0 && !isScanning.get ? (
          <DashboardVulnerabilities isLoading={isLoading} topVulnerabilities={data?.issues || []} />
        ) : !isLoading ? (
          <DashboardInvoke scanNumber={scanNumber.get} />
        ) : (
          <PageLoader />
        )}
        <div className="content-box-assets">
          <div className="box-assets card" style={{ flex: '0.7' }}>
            <DashboardAddResource data={data} />
          </div>
          <div className="box-assets card">
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
