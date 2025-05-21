import { useShowScreen } from '#commonHooks/useShowScreen';
import { UserProfilePageHeader } from './component/UserProfilePageHeader';
import { UserPassword } from './component/UserPassword';
import { UserQr } from './component/UserQr';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { useDashboard } from '@panelHooks/index';
import './userprofile.scss';

export const UserProfilePage = () => {
  const { isLoading, data } = useDashboard();
  const [showScreen] = useShowScreen();

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
