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
    <main
      className={`user-profile ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left">
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>User profile</h2>
              <p>
                Here you can update your password. We recommend storing it with KeePass. You can
                also enable two-factor authentication to improve your account security.
              </p>
            </div>
          </div>
        </div>
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
    </main>
  );
};
