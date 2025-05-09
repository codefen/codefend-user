import { useShowScreen } from '#commonHooks/useShowScreen';
import { UserProfileTop } from './components/userProfileTop';
import './userprofile.scss';
import { UserPassword } from './components/UserPassword';
import { UserQr } from './components/UserQr';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '../../../../components/DashboardScanStart/DashboardScanStart';
import { useDashboard } from '@panelHooks/index';

export const UserProfilePage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  const { isLoading, data } = useDashboard();

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <UserProfileTop />
        <div className="box-assets">
          <UserPassword />
          <UserQr />
        </div>
      </section>
      <section className="right">
        <VulnerabilitiesStatus vulnerabilityByShare={data?.issues_condicion || {}} />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
        {/* <DashboardScanStart /> */}
      </section>
    </main>
  );
};
