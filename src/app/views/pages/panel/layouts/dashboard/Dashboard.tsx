import React from 'react';

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
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { DashboardInvoke } from '@/app/views/components/DashboardInvoke/DashboardInvoke.tsx';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';

const Dashboard: React.FC = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const { setModalId, setIsOpen } = useModalStore();
  const navigate = useNavigate();
  const handleAddCollaborator = () => {
    setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
    setIsOpen(true);
  };

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
