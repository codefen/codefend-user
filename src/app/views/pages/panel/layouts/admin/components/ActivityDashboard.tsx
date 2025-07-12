import { type FC, useEffect } from 'react';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import { ActivityLineChart } from './ActivityLineChart';

export const ActivityDashboard: FC = () => {
  const { data: registrations, isLoading, fetchRegistrations } = useGetUserRegistrations();

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  if (isLoading) {
    return (
      <div className="card standard">
        <div className="over">
          <div className="header">
            <h2 className="table-title">Actividad diaria</h2>
          </div>
          <p>Actividad de leads, usuarios, compañías y scans (últimos 30 días)</p>
          <div className="body">
            <div className="loading">
              <p>Cargando datos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="card standard">
        <div className="over">
          <div className="header">
            <h2 className="table-title">Actividad diaria</h2>
          </div>
          <p>Actividad de leads, usuarios, compañías y scans (últimos 30 días)</p>
          <div className="body">
            <div className="chart-placeholder">
              <p>No hay datos para mostrar en el gráfico</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card standard">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Actividad diaria</h2>
        </div>
        <p>Actividad de leads, usuarios, compañías y scans (últimos 30 días)</p>
        <div className="body">
          {/* Gráfico de líneas */}
          <ActivityLineChart data={registrations} />
        </div>
      </div>
    </div>
  );
}; 