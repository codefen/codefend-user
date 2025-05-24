import { useShowScreen } from '#commonHooks/useShowScreen';
import { UserProfilePageHeader } from './component/UserProfilePageHeader';
import { UserPassword } from './component/UserPassword';
import { UserQr } from './component/UserQr';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { useDashboard } from '@panelHooks/index';
import './userprofile.scss';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useEffect } from 'react';

export const UserProfilePage = () => {
  const { isLoading, data } = useDashboard();
  const [showScreen] = useShowScreen();
  const appEvent = useGlobalFastField('appEvent');

  useEffect(() => {
    if (appEvent.get !== APP_EVENT_TYPE.USER_LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.TEAM_PAGE_CONDITION);
    }
  }, [appEvent.get]);

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <UserProfilePageHeader />
        <div className="box-assets">
          <UserPassword />
          <UserQr />
        </div>
      </section>
      <section className="right">
        <VulnerabilitiesStatus vulnerabilityByShare={data?.issues_condicion || {}} />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      </section>
    </main>
  );
};
