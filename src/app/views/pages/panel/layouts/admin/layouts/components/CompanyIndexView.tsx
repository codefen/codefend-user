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
import CompanyDeletionResultModal from '@/app/views/components/modals/CompanyDeletionResultModal';

interface ModalData {
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
  } = useGlobalFastFields([
    'selectedApp',
    'domainCount',
    'subNetworkCount',
    'externalIpCount',
    'internalIpCount',
    'totalNotUniqueIpCount',
  ]);

  // Estado para el modal de resultados de eliminación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Función para manejar la eliminación de empresa
  const handleDeleteCompany = async (row: any) => {
    if (!row || !row.name || !row.id) {
      console.error('Invalid company data:', row);
      return;
    }

    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar "${row.name}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      const result = await deleteCompany(row.id);
      
      if (result.success && result.companyName && result.deletionSummary && result.totalRecordsDeleted !== undefined) {
        setModalData({
          companyName: result.companyName,
          companyId: result.companyId || row.id,
          deletionSummary: result.deletionSummary,
          totalRecordsDeleted: result.totalRecordsDeleted,
        });
        setIsModalOpen(true);
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
      header: 'Country',
      key: 'mercado',
      styles: 'item-cell-6',
      weight: '9%',
      render: (val: any) => val,
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
      weight: '27%',
      render: (val: any) => val,
    },
    {
      header: 'Published',
      key: 'creacion',
      styles: 'item-cell-9',
      weight: '13%',
      render: (val: any) => (val ? naturalTime(val) : '--/--/--'),
    },
    {
      header: 'Options',
      key: 'options',
      styles: 'item-cell-10',
      weight: '5%',
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
      
      <CompanyDeletionResultModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        companyName={modalData?.companyName || ''}
        companyId={modalData?.companyId || ''}
        deletionSummary={modalData?.deletionSummary || {}}
        totalRecordsDeleted={modalData?.totalRecordsDeleted || 0}
      />
    </div>
  );
};

export default CompanyIndexView;
