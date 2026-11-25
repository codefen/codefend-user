import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { UserPassword } from './component/UserPassword';
import { UserQr } from './component/UserQr';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { useDashboard } from '@panelHooks/index';
import './userprofile.scss';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Navbar from '@/app/views/components/navbar/Navbar';

export const UserProfilePage = () => {
  const { isLoading, data } = useDashboard();
  const [showScreen] = useShowScreen();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.TEAM_PAGE_CONDITION);
    }
  }, []);

  useEffect(() => {
    document.title = 'Codefend: user profile';
  }, []);

  return (
    <PanelInterior
      title="User profile"
      ready={showScreen}
      description="Manage your password and two-factor authentication."
      className={`user-profile ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left">
        <div className="box-assets">
          <UserPassword />
          <UserQr />
        </div>
      </section>
      <section className="right">
        <Navbar />
        <VulnerabilitiesStatus
          isLoading={isLoading}
          vulnerabilityByShare={data?.issues_condicion || {}}
        />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      </section>
    </PanelInterior>
  );
};
