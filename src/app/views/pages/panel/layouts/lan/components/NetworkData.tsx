import { useState, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import type { Device } from '@interfaces/panel.ts';
import useModal from '#commonHooks/useModal.ts';
import type { ColumnTableV3 } from '@interfaces/table.tsx';
import { BugIcon, CredentialIcon, DocumentIcon, LanIcon, PlusIcon, TrashIcon } from '@icons';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import TextChild from '@/app/views/components/utils/TextChild';
import { LocationItem } from '@/app/views/components/utils/LocationItem';

interface LanNetworkDataProps {
  isLoading: boolean;
  internalNetwork: Device[];
  refetchInternalNetwork: () => void;
}

const networkColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1',
    weight: '8%',
    render: (ID: any) => ID,
  },
  {
    header: 'external ip',
    key: 'device_ex_address',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-2',
    weight: '24%',
    render: (row: any, next?: any) =>
      !row?.resource_lan_dad ? (
        row.device_ex_address
      ) : (
        <TextChild
          subNetwork={row.device_ex_address}
          isLast={!next || (next && !next.resource_lan_dad)}
        />
      ),
  },
  {
    header: 'internal ip',
    key: 'device_in_address',
    styles: 'item-cell-3',
    weight: '24%',
    render: (ip: any) => ip,
  },
  {
    header: 'area',
    key: 'server_pais',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '14%',
    render: (row: any) => (
      <LocationItem
        country={row?.server_pais || 'unknown'}
        countryCode={row?.server_pais_code || ''}
      />
    ),
  },
  {
    header: 'description',
    key: 'device_desc',
    styles: 'item-cell-5',
    weight: '30%',
    render: (desc: any) => desc,
  },
];

export const LanNetworkData: FC<LanNetworkDataProps> = ({ isLoading, internalNetwork }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { isAdmin, isProvider } = useUserRole();

  const { resourceType, openModal, resourceID, networkResourceSelected } = useGlobalFastFields([
    'resourceType',
    'openModal',
    'resourceID',
    'networkResourceSelected',
  ]);

  const generateReport = (resourceUpID: string, count: any) => {
    if (Number(count) >= 1) {
      openModal.set(true);
      resourceID.set(resourceUpID);
      resourceType.set(RESOURCE_CLASS.LAN_NET);
    }
  };

  const addIssue = (id: string) => {
    navigate(isProvider() || isAdmin() ? `/issues/create/lan/${id}` : '', {
      state: { redirect: location.pathname },
    });
  };

  const contextMenuActions = [
    {
      label: 'View report',
      disabled: (row: any) => Number(row?.final_issues) < 1,
      icon: <DocumentIcon isButton width={1.27} height={1.27} />,
      onClick: (row: any) => generateReport(row.id, row.final_issues),
    },
    {
      label: 'View credentials',
      icon: <CredentialIcon />,
      onClick: (row: any) => {
        setResourceId(row.id);
        setCredentialType('lan');
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.NETWORK_CREDS);
      },
    },
    {
      label: 'Delete',
      icon: <TrashIcon />,
      disabled: isProvider(),
      onClick: (row: any) => {
        networkResourceSelected.set(row);
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.DELETE_NETWORK);
      },
    },
    {
      label: 'Add issue',
      icon: <BugIcon isButton />,
      disabled: !(isProvider() || isAdmin()),
      onClick: (row: any) => addIssue(row.id),
    },
    {
      label: 'Add SubNetwork',
      icon: <PlusIcon />,
      disabled: (row: any) => !!row?.resource_lan_dad,
      onClick: (row: any) => {
        networkResourceSelected.set(row);
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.ADD_SUB_NETWORK);
      },
    },
  ];

  return (
    <div className="card table">
      <div className="over">
        {/* <div className="header">
          <div className="table-title">
            <h2>
              <div className="icon">
                <LanIcon />
              </div>
              Network structure
            </h2>
          </div>
        </div> */}

        <Tablev3
          columns={networkColumns}
          rows={internalNetwork}
          showRows={!isLoading}
          initialOrder="id"
          contextMenuActions={contextMenuActions}
          enableContextMenu={true}
        />
      </div>
    </div>
  );
};
