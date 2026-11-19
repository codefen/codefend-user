import { type FC, useState, useMemo } from 'react';
import './CompanyIndexView.scss';
import { useGetCompany } from '@userHooks/admins/useGetCompany';
import { useDeleteCompany } from '@userHooks/admins/useDeleteCompany';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import Tablev3 from '@table/v3/Tablev3.tsx';
import { naturalTimeSpanish } from '@utils/helper.ts';
import {
  useGlobalFastFields,
} from '@/app/views/context/AppContextProvider.tsx';
import { TrashIcon } from '@/app/views/components/icons';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import CompanyDeletionResultPanel from '@/app/views/components/modals/CompanyDeletionResultPanel.tsx';

interface PanelData {
  id: string;
  companyName: string;
  companyId: string | number;
  deletionSummary: { [tableName: string]: number };
  totalRecordsDeleted: number;
}

const CompanyIndexView: FC = () => {
  const { data, company, isLoading } = useGetCompany();
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

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar "${row.name}"? Esta acción no se puede deshacer.`
    );
    if (confirmed) {
      // 🚀 PRIMERO: Quitar INMEDIATAMENTE el item de la tabla
      // console.log('🗑️ Eliminando empresa de la tabla inmediatamente:', row.name);
      const updatedCompanies = companies.get.filter((company: any) => company.id !== row.id);
      companies.set(updatedCompanies);

      // 📡 SEGUNDO: Hacer la petición al servidor en background
      const result = await deleteCompany(row.id);

      if (
        result.success &&
        result.companyName &&
        result.deletionSummary &&
        result.totalRecordsDeleted !== undefined
      ) {
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

  const processedData = useMemo(() => data.map((c: any) => ({ ...c, id_num: parseInt(c.id) })), [data]);

  const companiesColumn: ColumnTableV3[] = [
    {
      header: 'ID',
      key: 'id_num',
      styles: 'item-cell-1',
      weight: '6%',
      render: (val: any, row: any) => (row?.id ?? val),
      sortFunction: (a: any, b: any) => {
        // Ordenamiento numérico en lugar de alfabético
        const numA = parseInt(a.id) || 0;
        const numB = parseInt(b.id) || 0;
        
        // La tabla maneja la dirección automáticamente
        // Solo necesitamos devolver la comparación numérica básica
        return numA - numB;
      },
    },
    {
      header: 'Compañía',
      key: 'name',
      styles: 'item-cell-2',
      weight: '21%',
      render: (name: string) => <span className="company-cell-name" title={name}>{name || '—'}</span>,
    },
    {
      header: 'Plan',
      key: 'plan',
      styles: 'item-cell-3',
      weight: '8%',
      render: (plan: string) => <span title={plan}>{plan || '—'}</span>,
    },
    {
      header: 'País',
      key: 'pais',
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-4',
      weight: '8%',
      render: (row: any) => {
        const countryCode = row?.pais_code || '';
        const countryName = row?.pais || 'Unknown';
        const hasValidCode = /^[a-z]{2}$/i.test(countryCode) && countryCode.toLowerCase() !== 'xx';

        return hasValidCode ? (
          <span className="company-country" title={countryName}>
            <span className={`flag flag-${countryCode.toLowerCase()}`} aria-hidden="true" />
            <span>{countryCode.toUpperCase()}</span>
          </span>
        ) : (
          <span title={countryName}>—</span>
        );
      },
    },
    {
      header: 'Dominio',
      key: 'web',
      styles: 'item-cell-5',
      weight: '16%',
      render: (domain: string) => <span title={domain}>{domain || '—'}</span>,
    },
    {
      header: 'Titular',
      key: 'owner_email',
      styles: 'item-cell-6',
      weight: '27%',
      render: (email: string) => <span title={email}>{email || '—'}</span>,
    },
    {
      header: 'Alta',
      key: 'creacion',
      styles: 'item-cell-7',
      weight: '14%',
      render: (value: string) => <span title={value}>{value ? naturalTimeSpanish(value) : '—'}</span>,
    },

  ];

  // Context menu actions
  const contextMenuActions = [
    {
      label: 'Delete Company',
      icon: <TrashIcon />,
      onClick: (row: any) => handleDeleteCompany(row),
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
        rows={processedData}
        showRows={!isLoading || processedData.length > 0}
        isNeedSearchBar
        searchPlaceholder="Buscar compañías…"
        emptyTitle="No se encontraron compañías"
        initialOrder="id_num"
        initialSort={Sort.desc}
        action={action}
        selected={company.get}
        selectedKey="id"
        className="table-admin"
        limit={0}
        enableVirtualization={false}
        virtualizationThreshold={9999}
        isNeedSort={true}
        enableContextMenu={true}
        contextMenuActions={contextMenuActions}
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
