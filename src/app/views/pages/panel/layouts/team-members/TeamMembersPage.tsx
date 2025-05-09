import './teammembers.scss';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useDashboard } from '@panelHooks/index';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '../../../../components/DashboardScanStart/DashboardScanStart';
import { TeamCollaborators } from './components/Teamcollaborators/teamCollaborators';
import { TeamMembersTable } from './components/teamMembersTable';

export const TeamMembersPage = () => {
  const { isLoading, data } = useDashboard();

  const [showScreen, _, refresh] = useShowScreen();
  return (
    <main className={`team-members ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <div className="box-assets">
          <TeamCollaborators />
        </div>
        <div className="box-assets">
          <TeamMembersTable isLoading={isLoading} members={data?.members || []} />
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
