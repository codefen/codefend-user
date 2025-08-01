import { type FC, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import '../../user-profile/userprofile.scss';
import { ActivityLineChart } from '../components/ActivityLineChart';
import { ActivityMetrics, DataTableSection } from '../components/ActivityDashboard';
import Navbar from '@/app/views/components/navbar/Navbar';

type ChartType = 'line' | 'bar';

const AdminLanders: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const {
    data: registrations,
    totals,
    fetchRegistrations,
    currentPeriod,
    isLoading,
  } = useGetUserRegistrations();

  // Estados para los controles del gráfico
  const [chartType, setChartType] = useState<ChartType>('line');
  const [visibleMetrics, setVisibleMetrics] = useState({
    visitas_unicas: true,
    leads: true,
    usuarios: true,
  });

  // Función para toggle de métricas
  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Cargar datos para las estadísticas (por defecto hoy)
  useEffect(() => {
    // console.log('🚀 AdminLanders mounted, loading initial data for today');
    fetchRegistrations('today');
  }, [fetchRegistrations]);

  // Manejar cambio de período sincronizado
  const handlePeriodChange = (period: 'today' | 'week' | '14days' | '21days') => {
    // console.log(`🔄 Period change requested: ${currentPeriod} → ${period}`);
    if (period !== currentPeriod) {
      fetchRegistrations(period);
    } else {
      console.log(`⚠️ Same period selected (${period}), skipping fetch`);
    }
  };

  return (
    <main
      className={`user-profile ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
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
            {/* Tarjeta de controles del gráfico */}
            <div className="card standard chart-controls-card">
              <div className="over">
                <div className="body">
                  <div className="unified-chart-controls">
                    {/* Checkboxes de métricas */}
                    {Object.entries(visibleMetrics).map(([metric, isVisible]) => {
                      const metricColors = {
                        visitas_unicas: '#999999',
                        leads: '#666666',
                        usuarios: '#ff6464',
                      };
                      const metricLabels = {
                        visitas_unicas: 'visitas',
                        leads: 'leads',
                        usuarios: 'users',
                      };

                      return (
                        <button
                          key={metric}
                          className={`metric-toggle ${isVisible ? 'active' : 'inactive'}`}
                          onClick={() => toggleMetric(metric as keyof typeof visibleMetrics)}
                          disabled={isLoading}
                          style={
                            {
                              '--metric-color': metricColors[metric as keyof typeof metricColors],
                            } as React.CSSProperties
                          }>
                          <span className="metric-checkbox">{isVisible ? '✓' : '○'}</span>
                          <span className="metric-label">
                            {metricLabels[metric as keyof typeof metricLabels]}
                          </span>
                        </button>
                      );
                    })}

                    {/* Separador */}
                    <div className="controls-separator"></div>

                    {/* Botones de tipo de gráfico */}
                    <button
                      className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
                      onClick={() => setChartType('line')}
                      disabled={isLoading}>
                      Líneas
                    </button>
                    <button
                      className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
                      onClick={() => setChartType('bar')}
                      disabled={isLoading}>
                      Barras
                    </button>

                    {/* Separador */}
                    <div className="controls-separator"></div>

                    {/* Selector de período */}
                    <button
                      className={`period-btn ${currentPeriod === 'today' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('today')}
                      disabled={isLoading}>
                      HOY
                    </button>
                    <button
                      className={`period-btn ${currentPeriod === 'week' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('week')}
                      disabled={isLoading}>
                      7D
                    </button>
                    <button
                      className={`period-btn ${currentPeriod === '14days' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('14days')}
                      disabled={isLoading}>
                      14D
                    </button>
                    <button
                      className={`period-btn ${currentPeriod === '21days' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('21days')}
                      disabled={isLoading}>
                      21D
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta del gráfico */}
            <div className="card standard">
              <div className="over">
                <div className="body">
                  <ActivityLineChart
                    data={registrations}
                    currentPeriod={currentPeriod}
                    onPeriodChange={handlePeriodChange}
                    isLoading={isLoading}
                    chartType={chartType}
                    visibleMetrics={visibleMetrics}
                  />
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
        <DataTableSection currentPeriod={currentPeriod} isLoading={isLoading} />
      </section>
    </main>
  );
};

export default AdminLanders;
