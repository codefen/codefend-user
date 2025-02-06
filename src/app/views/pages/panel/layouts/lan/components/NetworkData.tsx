import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useDeleteLan } from '@resourcesHooks/network/useDeleteLan';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import type { Device } from '@interfaces/panel.ts';
import useModal from '#commonHooks/useModal.ts';
import { useReportStore } from '@stores/report.store.ts';
import type { ColumnTableV3 } from '@interfaces/table.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import AddAccessPointModal from '@modals/adding-modals/AddAccessPointModal.tsx';
import { AddSubNetworkModal } from '@modals/adding-modals/AddSubNetworkModal';
import { BugIcon, CredentialIcon, DocumentIcon, LanIcon, TrashIcon } from '@icons';
import Show from '@defaults/Show';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';

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
    weight: '6%',
    render: (ID: any) => ID,
  },
  {
    header: 'external ip',
    key: 'device_ex_address',
    styles: 'item-cell-2',
    weight: '23%',
    render: (ip: any) => ip,
  },
  {
    header: 'internal ip',
    key: 'device_in_address',
    styles: 'item-cell-3',
    weight: '23%',
    render: (ip: any) => ip,
  },
  {
    header: 'description',
    key: 'device_desc',
    styles: 'item-cell-4',
    weight: '23%',
    render: (desc: any) => desc,
  },
];

export const LanNetworkData: FC<LanNetworkDataProps> = ({
  isLoading,
  internalNetwork,
  refetchInternalNetwork,
}) => {
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
  const { openModal, setResourceID, setResourceType } = useReportStore((state: any) => state);
  const handleDelete = () => {
    refetch(selectedLanIdToDelete);
  };
  const generateReport = (resourceID: string, count: any) => {
    if (Number(count) >= 1) {
      openModal();
      setResourceID(resourceID);
      setResourceType('lan');
    }
  };
  const tableData2 = [
    ...networkColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-5 action',
      weight: '25%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span
            className={`issue-icon issue-icon ${isProvider() || isAdmin() ? '' : 'disable'}`}
            title={`${isNormalUser() ? '' : 'Add Issue'}`}
            onClick={() =>
              navigate(isProvider() || isAdmin() ? `/issues/create/lan/${row.id}` : '', {
                state: { redirect: location.pathname },
              })
            }>
            <BugIcon isButton />
            <span className="codefend-text-red-200 issue-count">{row.final_issues}</span>
          </span>
          <span
            title="View report"
            className={`issue-printer ${Number(row.final_issues) == 0 ? 'off' : ''}`}
            onClick={() => generateReport(row.id, row.final_issues)}>
            <DocumentIcon isButton width={1.27} height={1.27} />
          </span>
          <span
            title="Add credentials"
            onClick={() => {
              setResourceId(row.id);
              setCredentialType('lan');
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.NETWORK_CREDS);
            }}>
            <CredentialIcon />
          </span>
          <Show when={isAdmin() || isNormalUser()}>
            <span
              title="Delete"
              onClick={() => {
                setSelectedLanIdToDelete(row.id);
                setShowModal(!showModal);
                setShowModalStr(MODAL_KEY_OPEN.DELETE_NETWORK);
              }}>
              <TrashIcon />
            </span>
          </Show>
        </div>
      ),
    },
  ];

  return (
    <>
      <ModalTitleWrapper
        headerTitle="Delete LAN"
        close={() => setShowModal(false)}
        isActive={showModal && showModalStr === MODAL_KEY_OPEN.DELETE_NETWORK}>
        <ConfirmModal
          header=""
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setShowModal(false)}
          action={() => {
            handleDelete();
          }}
        />
      </ModalTitleWrapper>

      <AddAccessPointModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_NETWORK}
        onDone={() => {
          setShowModal(false);
          refetchInternalNetwork();
        }}
        close={() => setShowModal(false)}
      />
      <AddSubNetworkModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_SUB_NETWORK}
        onDone={() => {
          refetchInternalNetwork();
        }}
        close={() => setShowModal(false)}
        internalNetwork={internalNetwork ?? []}
      />
      <div className="card table">
        <div className="header">
          <div className="title">
            <div className="icon">
              <LanIcon />
            </div>
            <span>Network structure</span>
          </div>
          <div className="actions">
            <div
              onClick={() => {
                setShowModal(!showModal);
                setShowModalStr(MODAL_KEY_OPEN.ADD_NETWORK);
              }}>
              Add access point
            </div>
            <div
              onClick={() => {
                setShowModal(!showModal);
                setShowModalStr(MODAL_KEY_OPEN.ADD_SUB_NETWORK);
              }}>
              Add network device
            </div>
          </div>
        </div>

        <Tablev3
          columns={tableData2}
          rows={internalNetwork}
          showRows={!isLoading}
          initialOrder="id"
        />
      </div>
    </>
  );
};
