import { type FC, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import '../../user-profile/userprofile.scss';
import { ActivityLineChart } from '../components/ActivityLineChart'; // Importar componente original
import { ActivityMetrics, DataTableSection } from '../components/ActivityDashboard';
import Navbar from '@/app/views/components/navbar/Navbar';

const AdminLanders: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { data: registrations, totals, fetchRegistrations } = useGetUserRegistrations();

  // Cargar datos para las estadísticas
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left full-width">
        <Navbar />
        
        {/* Card 1: Header - Todo el ancho */}
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>Landers Monitoring</h2>
              <p>Monitoreo de visitas, conversiones y datos de dispositivos en la tabla landers.</p>
            </div>
          </div>
        </div>
        
        {/* Cards 2 y 3: Gráfico (70%) y Métricas (30%) lado a lado */}
        <div className="landers-layout-container">
          <div className="chart-section">
            <ActivityLineChart data={registrations} />
          </div>
          <div className="metrics-section">
            <ActivityMetrics totals={totals} />
          </div>
        </div>
        
        {/* Card 4: Tabla de datos - Todo el ancho */}
        <DataTableSection />
      </section>
    </main>
  );
};

export default AdminLanders; 