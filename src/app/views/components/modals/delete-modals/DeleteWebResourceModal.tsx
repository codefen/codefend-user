import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { ConfirmModal } from '@modals/index';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import { useDeleteWebResource } from '@resourcesHooks/web/useDeleteWebResources';
import useModalStore from '@stores/modal.store';

export const DeleteWebResourceModal = () => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const { handleDelete, selected } = useDeleteWebResource();
  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === MODAL_KEY_OPEN.DELETE_WEB}
      close={() => setIsOpen(false)}
      type="med-w"
      headerTitle="Delete web resource">
      <ConfirmModal
        header={`Are you sure to remove\n ${selected?.resource_domain} - ${selected?.main_server}`}
        cancelText="Cancel"
        confirmText="Delete"
        close={() => setIsOpen(false)}
        action={() => handleDelete().then(() => setIsOpen(false))}
      />
    </ModalTitleWrapper>
  );
};
