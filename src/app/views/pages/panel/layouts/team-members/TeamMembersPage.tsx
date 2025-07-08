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
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

export const TeamMembersPage = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.TEAM_PAGE_CONDITION);
    }
  }, []);
  return (
    <main
      className={
        `team-members ${showScreen ? 'actived' : ''}` +
        `${!isDesktop ? ' sidebar-mobile-active' : ''}`
      }>
      <section className="left">
        <div className="box-assets">
          <TeamMemberPageHeader />
        </div>
        <VulnerabilitiesStatus
          isLoading={isLoading}
          vulnerabilityByShare={data?.issues_condicion || {}}
        />
        <TeamMembersTableCard isLoading={isLoading} members={data?.members || []} />
      </section>
      <section className="right">
        <Navbar />
        <DashboardScanStart />
        <VulnerabilitiesStatus
          isLoading={isLoading}
          vulnerabilityByShare={data?.issues_condicion || {}}
        />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      </section>
    </main>
  );
};
