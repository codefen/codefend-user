import { type FC, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import '../../user-profile/userprofile.scss';
import { CreateCompany } from '../components/CreateCompany';
import { DeleteNeuroscans } from '../components/DeleteNeuroscans';
import { NewUsersDaily } from '../components/NewUsersDaily';
import { ActivityDashboard } from '../components/ActivityDashboard';
import { ActivityStats } from '../components/ActivityStats';
import Navbar from '@/app/views/components/navbar/Navbar';

const AdminSection: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { totals, fetchRegistrations } = useGetUserRegistrations();

  // Cargar datos para las estadísticas
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left">
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>Administration</h2>
              <p>This is a new section for admins.</p>
            </div>
          </div>
        </div>
        
        {/* Gráfico de actividad diaria - se muestra automáticamente */}
        <ActivityDashboard />
        
        {/* <NewUsersDaily /> */}
      </section>
      <section className="right">
        <Navbar />
        <ActivityStats totals={totals} />
        <div className="box-assets">
          <DeleteNeuroscans />
          <CreateCompany />
        </div>
      </section>
    </main>
  );
};

export default AdminSection; 