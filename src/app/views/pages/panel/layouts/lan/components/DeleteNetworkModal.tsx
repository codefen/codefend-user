import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import { useDeleteLan } from '@resourcesHooks/network/useDeleteLan';
import useModalStore from '@stores/modal.store';

export const DeleteNetworkModal = () => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const { refetch, lanText } = useDeleteLan();

  return (
    <ModalTitleWrapper
      headerTitle="Delete LAN"
      close={() => setIsOpen(false)}
      isActive={isOpen && modalId === MODAL_KEY_OPEN.DELETE_NETWORK}>
      <ConfirmModal
        header={`Are you sure you want to delete ${lanText}?`}
        cancelText="Cancel"
        confirmText="Delete"
        close={() => setIsOpen(false)}
        action={() => {
          refetch().then(() => setIsOpen(false));
        }}
      />
    </ModalTitleWrapper>
  );
};
