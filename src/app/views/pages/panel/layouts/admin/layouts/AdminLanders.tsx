import { type FC, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import '../../user-profile/userprofile.scss';
import { ActivityDashboard } from '../components/ActivityDashboard';
import Navbar from '@/app/views/components/navbar/Navbar';

const AdminLanders: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { totals, fetchRegistrations } = useGetUserRegistrations();

  // Cargar datos para las estadísticas
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left full-width">
        <Navbar />
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>Landers Monitoring</h2>
              <p>Monitoreo de visitas, conversiones y datos de dispositivos en la tabla landers.</p>
            </div>
          </div>
        </div>
        
        {/* Gráfico de actividad diaria + tabla de raw data - ocupa todo el ancho */}
        <ActivityDashboard />
      </section>
    </main>
  );
};

export default AdminLanders; 