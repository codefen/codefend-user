import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import useModal from '@hooks/common/useModal';
import { useReportStore } from '@stores/report.store';
import type { ColumnTableV3 } from '@interfaces/table';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { TrashIcon, BugIcon, SourceCodeIcon, CredentialIcon, DocumentIcon } from '@icons';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import { AddRepositoryModal } from '@modals/adding-modals/AddRepositoryModal';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';
import Show from '@/app/views/components/Show/Show';
import { useDeleteSourceCode } from '@resourcesHooks/sourcecode/useDeleteSourceCode';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';

interface SourceCodeProps {
  isLoading: boolean;
  sourceCode: any[];
  refetch: () => void;
}

const sourceCodeColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1',
    weight: '6%',
    render: (ID: any) => ID,
  },
  {
    header: 'name',
    key: 'name',
    styles: 'item-cell-2',
    weight: '20%',
    render: (name: any) => name,
  },
  {
    header: 'url',
    key: 'access_link',
    styles: 'item-cell-3',
    weight: '36%',
    render: (url: any) => url,
  },
  {
    header: 'visibility',
    key: 'is_public',
    styles: 'item-cell-4',
    weight: '9%',
    render: (visibility: any) => visibility,
  },
  {
    header: 'source code',
    key: 'source_code',
    styles: 'item-cell-5',
    weight: '9%',
    render: (sourceCode: any) => sourceCode,
  },
];

export const SourceCodeResources: FC<SourceCodeProps> = props => {
  const navigate = useNavigate();
  const { deletedResource } = useDeleteSourceCode();
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();
  const [selectedSourceCodeIdToDelete, setSelectedSourceCodeIdToDelete] = useState<string>('');
  const { isAdmin, isProvider, isNormalUser } = useUserRole();
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { openModal, setResourceID, setResourceType } = useReportStore((state: any) => state);
  const generateReport = (resourceID: string, count: any) => {
    if (Number(count) >= 1) {
      openModal();
      setResourceID(resourceID);
      setResourceType(RESOURCE_CLASS.SOURCE);
    }
  };
  const sourceCodeColumnsWithActions = [
    ...sourceCodeColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-6 action',
      weight: '20%',
      render: (repository: any) => (
        <div className="publish" key={`actr-${repository.id}`}>
          <span
            className={`issue-icon ${isProvider() || isAdmin() ? '' : 'disable'}`}
            title={`${isNormalUser() ? '' : 'Add Issue'}`}
            onClick={() =>
              navigate(isProvider() || isAdmin() ? `/issues/create/source/${repository.id}` : '', {
                state: { redirect: '/source' },
              })
            }>
            <BugIcon isButton />
            <span className="codefend-text-red-200 issue-count">{repository.final_issues}</span>
          </span>
          <span
            title="View report"
            className={`issue-printer ${Number(repository.final_issues) == 0 ? 'off' : ''}`}
            onClick={() => generateReport(repository.id, repository.final_issues)}>
            <DocumentIcon isButton width={1.27} height={1.27} />
          </span>
          <Show when={isNormalUser() || isAdmin()}>
            <span
              title="Delete"
              onClick={() => {
                setSelectedSourceCodeIdToDelete(repository.id);
                setShowModal(!showModal);
                setShowModalStr(MODAL_KEY_OPEN.DELETE_SOURCE);
              }}>
              <TrashIcon />
            </span>
          </Show>

          <span
            title="Add credentials"
            onClick={() => {
              setResourceId(repository.id);
              setCredentialType(RESOURCE_CLASS.SOURCE);
              setIsOpen(true);
              setModalId(RESOURCE_CLASS.SOURCE);
            }}>
            <CredentialIcon />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <ModalTitleWrapper
        close={() => setShowModal(false)}
        headerTitle="Delete source code"
        isActive={showModal && showModalStr === MODAL_KEY_OPEN.DELETE_SOURCE}>
        <ConfirmModal
          cancelText="Cancel"
          confirmText="Delete"
          header=""
          close={() => setShowModal(!showModal)}
          action={() => {
            deletedResource(selectedSourceCodeIdToDelete);
            setShowModal(!showModal);
            props.refetch();
          }}
        />
      </ModalTitleWrapper>
      <AddRepositoryModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_SOURCE}
        onDone={() => {
          setShowModal(!showModal);
          props.refetch();
        }}
        close={() => setShowModal(!showModal)}
      />
      <div className="card">
        <div className="header">
          <div className="title">
            <div className="icon">
              <SourceCodeIcon />
            </div>
            <span>Source code</span>
          </div>
          <div className="actions">
            <div
              onClick={() => {
                setShowModal(true);
                setShowModalStr(MODAL_KEY_OPEN.ADD_SOURCE);
              }}>
              Add repository
            </div>
          </div>
        </div>

        <Tablev3
          columns={sourceCodeColumnsWithActions}
          rows={props.sourceCode}
          showRows={!props.isLoading}
          initialOrder="id"
        />
      </div>
    </>
  );
};
