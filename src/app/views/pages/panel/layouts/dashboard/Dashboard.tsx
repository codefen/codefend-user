import React, { useEffect } from 'react';

import DashboardCollaborators from './components/DashboardCollaborators.tsx';
import DashboardVulnerabilities from './components/DashboardVulnerabilities.tsx';

import { useDashboard } from '@panelHooks/dashboard/useDashboard.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import './dashboard.scss';
import { PrimaryButton } from '@buttons/index.ts';
import { useNavigate } from 'react-router';
import DashboardAssets from '../../../../components/DashboardAssets/DashboardAssets.tsx';
import { DashboardInvoke } from '@/app/views/components/DashboardInvoke/DashboardInvoke.tsx';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';

const Dashboard: React.FC = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const navigate = useNavigate();
  const company = useGlobalFastField('company');

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
        {data?.issues && data.issues.length > 0 ? (
          <DashboardVulnerabilities isLoading={isLoading} topVulnerabilities={data?.issues || []} />
        ) : !isLoading ? (
          <DashboardInvoke />
        ) : (
          <PageLoader />
        )}
        <DashboardAssets resources={data?.resources || {}} />
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </section>

      <section className="right">
        <VulnerabilitiesStatus vulnerabilityByShare={data?.issues_condicion || {}} />
        <PrimaryButton
          text="Go to vulnerabilities"
          buttonStyle="red"
          className="full"
          click={() => navigate('/issues')}
          disabledLoader
        />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      </section>
    </main>
  );
};

export default Dashboard;
