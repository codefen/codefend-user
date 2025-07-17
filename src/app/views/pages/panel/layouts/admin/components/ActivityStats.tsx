import { type FC } from 'react';

interface ActivityStatsProps {
  totals: {
    leads: number;
    usuarios: number;
    companias: number;
    neuroscans: number;
    issues_vistos: number;
    orders: number;
  };
}

export const ActivityStats: FC<ActivityStatsProps> = ({ totals }) => {
  const stats = [
    {
      value: totals.leads,
      label: 'LEADS',
      color: '#ff4757' // Rojo
    },
    {
      value: totals.usuarios,
      label: 'USUARIOS',
      color: '#3742fa' // Azul
    },
    {
      value: totals.orders,
      label: 'ÓRDENES',
      color: '#007bff' // Azul
    },
    {
      value: totals.issues_vistos,
      label: 'ISSUES VISTOS',
      color: '#747d8c' // Gris
    }
  ];

  return (
    <div className="activity-stats-table">
      <div className="stats-header">
        <h4>Actividad (30 días)</h4>
      </div>
      <div className="stats-rows">
        {stats.map((stat, index) => (
          <div key={index} className="stat-row">
            <span className="stat-name">{stat.label.toLowerCase()}</span>
            <span className="stat-count" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 