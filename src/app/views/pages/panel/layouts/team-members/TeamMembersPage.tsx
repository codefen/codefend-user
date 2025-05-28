import { useShowScreen } from '#commonHooks/useShowScreen';
import { useDashboard } from '@panelHooks/index';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { TeamMemberPageHeader } from './components/TeamMemberPageHeader';
import { TeamMembersTableCard } from './components/TeamMembersTableCard';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart';
import './teammembers.scss';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';

export const TeamMembersPage = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.TEAM_PAGE_CONDITION);
    }
  }, []);
  return (
    <main className={`team-members ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <div className="box-assets">
          <TeamMemberPageHeader />
        </div>
        <div className="box-assets">
          <TeamMembersTableCard isLoading={isLoading} members={data?.members || []} />
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
