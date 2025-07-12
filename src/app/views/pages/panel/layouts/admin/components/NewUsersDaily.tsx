import { type FC, useEffect } from 'react';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import Tablev3 from '@table/v3/Tablev3';
import { type ColumnTableV3 } from '@interfaces/table';

interface DailyData {
  fecha: string;
  leads: string;
  usuarios: string;
  companias: string;
  neuroscans: string;
  issues_vistos: string;
}

const columns: ColumnTableV3[] = [
  {
    header: 'fecha',
    key: 'fecha',
    weight: '15%',
    styles: 'item-cell-1',
    render: (fecha: string) => new Date(fecha).toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    }),
  },
  {
    header: 'leads',
    key: 'leads',
    weight: '17%',
    styles: 'item-cell-2',
    render: (leads: string) => leads || '0',
  },
  {
    header: 'usuarios',
    key: 'usuarios',
    weight: '17%',
    styles: 'item-cell-3',
    render: (usuarios: string) => usuarios || '0',
  },
  {
    header: 'compañías',
    key: 'companias',
    weight: '17%',
    styles: 'item-cell-4',
    render: (companias: string) => companias || '0',
  },
  {
    header: 'neuroscans',
    key: 'neuroscans',
    weight: '17%',
    styles: 'item-cell-5',
    render: (neuroscans: string) => neuroscans || '0',
  },
  {
    header: 'issues vistos',
    key: 'issues_vistos',
    weight: '17%',
    styles: 'item-cell-6',
    render: (issues_vistos: string) => issues_vistos || '0',
  },
];

export const NewUsersDaily: FC = () => {
  const { data: registrations, isLoading, fetchRegistrations } = useGetUserRegistrations();

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  if (isLoading) {
    return (
      <div className="card standard">
        <div className="header">
          <h3>Datos detallados</h3>
        </div>
        <div className="body">
          <div className="loading">
            <p>Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card standard">
      <div className="header">
        <h3>Datos detallados</h3>
      </div>
      <div className="body">
        {/* Tabla de datos */}
        <Tablev3
          columns={columns}
          rows={registrations}
          showRows={!!registrations.length}
          limit={30}
          isNeedSort={true}
          isNeedSearchBar={false}
          className="admin-activity-table"
        />
      </div>
    </div>
  );
}; 