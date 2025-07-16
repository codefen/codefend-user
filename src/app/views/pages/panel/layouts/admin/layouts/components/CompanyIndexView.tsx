import { type FC, useEffect, useState } from 'react';
import CompanyCard from './CompanyCard.tsx';
import './CompanyIndexView.scss';
import { useGetCompany } from '@userHooks/admins/useGetCompany';
import { useDeleteCompany } from '@userHooks/admins/useDeleteCompany';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import Tablev3 from '@table/v3/Tablev3.tsx';
import { naturalTime } from '@utils/helper.ts';
import {
  useGlobalFastField,
  useGlobalFastFields,
} from '@/app/views/context/AppContextProvider.tsx';
import { TrashIcon } from '@/app/views/components/icons';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import CompanyDeletionResultPanel from '@/app/views/components/modals/CompanyDeletionResultPanel.tsx';

// Función para formatear fecha en formato europeo "05/07/2025"
const formatDateEuropean = (dateString: string): string => {
  if (!dateString) return '--/--/--';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '--/--/--';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '--/--/--';
  }
};

interface PanelData {
  id: string;
  companyName: string;
  companyId: string | number;
  deletionSummary: { [tableName: string]: number };
  totalRecordsDeleted: number;
}

const CompanyIndexView: FC = () => {
  const { data, company } = useGetCompany();
  const { deleteCompany } = useDeleteCompany();
  const {
    selectedApp,
    domainCount,
    subNetworkCount,
    externalIpCount,
    internalIpCount,
    totalNotUniqueIpCount,
    companies,
  } = useGlobalFastFields([
    'selectedApp',
    'domainCount',
    'subNetworkCount',
    'externalIpCount',
    'internalIpCount',
    'totalNotUniqueIpCount',
    'companies',
  ]);

  // Estado para múltiples paneles de resultados de eliminación
  const [deletionPanels, setDeletionPanels] = useState<PanelData[]>([]);

  // Función para cerrar un panel específico
  const handleClosePanel = (panelId: string) => {
    setDeletionPanels(prev => prev.filter(panel => panel.id !== panelId));
  };

  // Función para manejar la eliminación de empresa
  const handleDeleteCompany = async (row: any) => {
    if (!row || !row.name || !row.id) {
      console.error('Invalid company data:', row);
      return;
    }

    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar "${row.name}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      // 🚀 PRIMERO: Quitar INMEDIATAMENTE el item de la tabla
      console.log('🗑️ Eliminando empresa de la tabla inmediatamente:', row.name);
      const updatedCompanies = companies.get.filter((company: any) => company.id !== row.id);
      companies.set(updatedCompanies);
      
      // 📡 SEGUNDO: Hacer la petición al servidor en background
      const result = await deleteCompany(row.id);
      
      if (result.success && result.companyName && result.deletionSummary && result.totalRecordsDeleted !== undefined) {
        // 📊 TERCERO: Mostrar el panel de confirmación
        const newPanel: PanelData = {
          id: `deletion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          companyName: result.companyName,
          companyId: result.companyId || row.id,
          deletionSummary: result.deletionSummary,
          totalRecordsDeleted: result.totalRecordsDeleted,
        };
        
        // Agregar el nuevo panel al array
        setDeletionPanels(prev => [...prev, newPanel]);
      } else {
        // 🚨 Si hubo error, restaurar el item en la tabla
        console.error('❌ Error al eliminar empresa, restaurando en la tabla');
        const currentCompanies = companies.get;
        const restoredCompanies = [...currentCompanies, row].sort((a, b) => a.id - b.id);
        companies.set(restoredCompanies);
      }
      // Los errores ya se manejan en el hook con toast
    }
  };

  const companiesColumn: ColumnTableV3[] = [
    {
      header: 'ID',
      key: 'id',
      styles: 'item-cell-1',
      weight: '3%',
      render: (ID: any) => ID,
    },
    {
      header: 'Name',
      key: 'name',
      styles: 'item-cell-2',
      weight: '14%',
      render: (name: any) => name,
    },
    {
      header: 'Plan',
      key: 'plan',
      styles: 'item-cell-3',
      weight: '6%',
      render: (val: any) => val,
    },
    {
      header: 'Issues Left',
      key: 'disponibles_issues_view',
      styles: 'item-cell-4',
      weight: '9%',
      render: (val: any) => val,
    },
    {
      header: 'Scans',
      key: 'disponibles_neuroscan',
      styles: 'item-cell-5',
      weight: '5%',
      render: (val: any) => val,
    },
    {
      header: 'area',
      key: 'pais',
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-6',
      weight: '9%',
      render: (row: any) => {
        const countryCode = row?.pais_code || '';
        const countryName = row?.pais || 'Unknown';
        const hasValidCode = countryCode && countryCode.length >= 2;
        
        return hasValidCode ? (
          <span 
            className={`flag flag-${countryCode.toLowerCase()}`}
            title={countryName}
            style={{ cursor: 'help' }}
          ></span>
        ) : (
          <span title={countryName} style={{ cursor: 'help' }}>🌍</span>
        );
      },
    },
    {
      header: 'Website',
      key: 'web',
      styles: 'item-cell-7',
      weight: '14%',
      render: (val: any) => val,
    },
    {
      header: 'Owner',
      key: 'owner_email',
      styles: 'item-cell-8',
      weight: '25%',
      render: (val: any) => val,
    },
    {
      header: 'Published',
      key: 'creacion',
      styles: 'item-cell-9',
      weight: '11%',
      render: (val: any) => (val ? formatDateEuropean(val) : '--/--/--'),
    },
    {
      header: 'Options',
      key: 'options',
      styles: 'item-cell-10',
      weight: '4%',
      type: TABLE_KEYS.FULL_ROW,
      render: (row: any) => (
        <div className="options-actions">
          <button 
            className="delete-btn codefend-text-red" 
            title="Delete Company"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCompany(row);
            }}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  const action = (clickedCompany: any) => {
    company.set(clickedCompany);
    selectedApp.set(null);
    domainCount.set(0);
    subNetworkCount.set(0);
    externalIpCount.set(0);
    internalIpCount.set(0);
    totalNotUniqueIpCount.set(0);
  };



  return (
    <div className="CompanyIndexView">
      <Tablev3
        columns={companiesColumn}
        rows={data}
        showRows={Boolean(data?.length)}
        isNeedSearchBar
        initialOrder="id"
        initialSort={Sort.desc}
        action={action}
        selected={company.get}
        selectedKey="id"
        className="table-admin"
      />
      
      {/* Renderizar múltiples paneles */}
      {deletionPanels.map((panel, index) => (
        <CompanyDeletionResultPanel
          key={panel.id}
          panelId={panel.id}
          stackIndex={index} // Usar el índice actual en el array, no el stackIndex original
          totalPanels={deletionPanels.length} // Total de paneles activos
          onClose={() => handleClosePanel(panel.id)}
          companyName={panel.companyName}
          companyId={panel.companyId}
          deletionSummary={panel.deletionSummary}
          totalRecordsDeleted={panel.totalRecordsDeleted}
        />
      ))}
    </div>
  );
};

export default CompanyIndexView;
