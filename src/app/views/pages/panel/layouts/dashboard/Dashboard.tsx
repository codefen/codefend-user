import React from 'react';

import DashboardAssets from '../../../../../components/DashboardAssets/DashboardAssets.tsx';
import DashboardCollaborators from '../../../../../components/DashboardCollaborators/DashboardCollaborators.tsx';
import DashboardVulnerabilities from './components/DashboardVulnerabilities.tsx';

import { useDashboard } from '@panelHooks/dashboard/useDashboard.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import './dashboard.scss';
import { PrimaryButton } from '@buttons/index.ts';
import { useNavigate } from 'react-router';

const Dashboard: React.FC = () => {
  const flashlight = useFlashlight();
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const navigate = useNavigate();

  return (
    <main className={`dashboard ${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>

      <section className="left">
        <DashboardVulnerabilities isLoading={isLoading} topVulnerabilities={data?.issues || []} />
        <DashboardAssets resources={data?.resources || {}} />
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </section>

      <section className="right" ref={flashlight.rightPaneRef}>
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
