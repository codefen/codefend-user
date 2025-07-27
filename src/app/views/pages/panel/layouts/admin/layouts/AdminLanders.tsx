import { type FC, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import '../../user-profile/userprofile.scss';
import { ActivityLineChart } from '../components/ActivityLineChart';
import { ActivityMetrics, DataTableSection } from '../components/ActivityDashboard';
import Navbar from '@/app/views/components/navbar/Navbar';

const AdminLanders: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { data: registrations, totals, fetchRegistrations, currentPeriod, isLoading } = useGetUserRegistrations();

  // Cargar datos para las estadísticas (por defecto hoy)
  useEffect(() => {
    fetchRegistrations('today');
  }, []);

  // Manejar cambio de período sincronizado
  const handlePeriodChange = (period: 'today' | 'week') => {
    fetchRegistrations(period);
  };

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
            <div className="card standard">
              <div className="over">
                <div className="body">
                  <div className="chart-header">
                    <div className="period-selector">
                      <div className="period-buttons">
                        <button
                          className={`period-btn ${currentPeriod === 'today' ? 'active' : ''}`}
                          onClick={() => handlePeriodChange('today')}
                          disabled={isLoading}
                        >
                          📅 Hoy
                        </button>
                        <button
                          className={`period-btn ${currentPeriod === 'week' ? 'active' : ''}`}
                          onClick={() => handlePeriodChange('week')}
                          disabled={isLoading}
                        >
                          📊 Últimos 7 días
                        </button>
                      </div>
                    </div>
                  </div>
                  <ActivityLineChart data={registrations} />
                </div>
              </div>
            </div>
          </div>
          <div className="metrics-section">
            <ActivityMetrics 
              totals={totals} 
              currentPeriod={currentPeriod}
              onPeriodChange={handlePeriodChange}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        {/* Card 4: Tabla de datos - Todo el ancho */}
        <DataTableSection />
      </section>
    </main>
  );
};

export default AdminLanders; 