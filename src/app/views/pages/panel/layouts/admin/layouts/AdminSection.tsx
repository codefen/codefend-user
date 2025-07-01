import { type FC } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { useDashboard } from '@panelHooks/index';
import '../../user-profile/userprofile.scss';
import { CreateCompany } from '../components/CreateCompany';
import { DeleteNeuroscans } from '../components/DeleteNeuroscans';

const AdminSection: FC = () => {
  const { isLoading, data } = useDashboard();
  const [showScreen] = useShowScreen();

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>Administration</h2>
              <p>This is a new section for admins.</p>
            </div>
          </div>
        </div>
        <div className="box-assets">
          <DeleteNeuroscans />
          <CreateCompany />
        </div>
      </section>
      <section className="right">
        <VulnerabilitiesStatus vulnerabilityByShare={data?.issues_condicion || {}} />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      </section>
    </main>
  );
};

export default AdminSection; 