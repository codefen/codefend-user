import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { sourceCodeColumns } from '@mocks/defaultData';
import useModal from '@hooks/common/useModal';
import { useReportStore } from '@stores/report.store';
import type { TableItem } from '@interfaces/table';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { TrashIcon, BugIcon, SourceCodeIcon, CredentialIcon, DocumentIcon } from '@icons';
import { TableV2 } from '@table/tablev2.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import { AddRepositoryModal } from '@modals/adding-modals/AddRepositoryModal';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';
import Show from '@defaults/Show';
import { useDeleteSourceCode } from '@resourcesHooks/sourcecode/useDeleteSourceCode';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';

interface SourceCodeProps {
  isLoading: boolean;
  sourceCode: any[];
  refetch: () => void;
}

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

  const dataTable = props.sourceCode.map(
    repository =>
      ({
        ID: { value: Number(repository.id), style: 'id' },
        name: { value: repository.name, style: 'full-name' },
        url: { value: repository.access_link, style: 'url' },
        visibility: { value: repository.is_public, style: 'boolean' },
        sourceCode: { value: repository.source_code, style: 'source-code' },
        action: {
          value: (
            <>
              <span
                className={`issue-icon ${isProvider() || isAdmin() ? '' : 'disable'}`}
                title={`${isNormalUser() ? '' : 'Add Issue'}`}
                onClick={() =>
                  navigate(
                    isProvider() || isAdmin() ? `/issues/create/source/${repository.id}` : '',
                    { state: { redirect: '/source' } }
                  )
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
            </>
          ),
          style: 'id action',
        },
      }) as Record<string, TableItem>
  );

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
        <TableV2
          rowsData={dataTable || []}
          columns={sourceCodeColumns}
          showRows={!props.isLoading}
          showEmpty={!props.isLoading && dataTable.length === 0}
        />
      </div>
    </>
  );
};
