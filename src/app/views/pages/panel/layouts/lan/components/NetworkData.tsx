import { useState, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useDeleteLan } from '@resourcesHooks/network/useDeleteLan';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import type { Device } from '@interfaces/panel.ts';
import useModal from '#commonHooks/useModal.ts';
import type { ColumnTableV3 } from '@interfaces/table.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { BugIcon, CredentialIcon, DocumentIcon, LanIcon, TrashIcon } from '@icons';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import TextChild from '@/app/views/components/utils/TextChild';

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
    weight: '9%',
    render: (ID: any) => ID,
  },
  {
    header: 'external ip',
    key: 'device_ex_address',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-2',
    weight: '28%',
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
    weight: '28%',
    render: (ip: any) => ip,
  },
  {
    header: 'description',
    key: 'device_desc',
    styles: 'item-cell-4',
    weight: '35%',
    render: (desc: any) => desc,
  },
];

export const LanNetworkData: FC<LanNetworkDataProps> = ({
  isLoading,
  internalNetwork,
  refetchInternalNetwork,
}) => {
  const [lanText, setLanText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { isAdmin, isNormalUser, isProvider } = useUserRole();
  const { selectedLanIdToDelete, setSelectedLanIdToDelete, refetch } = useDeleteLan(
    refetchInternalNetwork,
    () => setShowModal(false)
  );
  const { resourceType, openModal, resourceID } = useGlobalFastFields([
    'resourceType',
    'openModal',
    'resourceID',
  ]);

  const handleDelete = () => {
    refetch(selectedLanIdToDelete);
  };
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
        setSelectedLanIdToDelete(row.id);
        setShowModal(!showModal);
        setShowModalStr(MODAL_KEY_OPEN.DELETE_NETWORK);
        setLanText(
          `${row?.device_ex_address ? row?.device_ex_address + ' / ' : ''}${row?.device_in_address || ''}`
        );
      },
    },
    {
      label: 'Add issue',
      icon: <BugIcon isButton />,
      disabled: !(isProvider() || isAdmin()),
      onClick: (row: any) => addIssue(row.id),
    },
  ];

  return (
    <>
      <ModalTitleWrapper
        headerTitle="Delete LAN"
        close={() => setShowModal(false)}
        isActive={showModal && showModalStr === MODAL_KEY_OPEN.DELETE_NETWORK}>
        <ConfirmModal
          header={`Are you sure you want to delete ${lanText}?`}
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setShowModal(false)}
          action={() => {
            handleDelete();
          }}
        />
      </ModalTitleWrapper>

      <div className="card table">
        <div className="over">
          <div className="header">
            <div className="table-title">
              <h2>
                <div className="icon">
                  <LanIcon />
                </div>
                Network structure
              </h2>
            </div>
          </div>

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
    </>
  );
};
