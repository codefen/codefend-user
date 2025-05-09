import { ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { ChangePasswordForm } from '@/app/views/components/forms/ChangePasswordForm';

export const ChangePasswordModal = () => {
  const { isOpen, modalId, setModalId, setIsOpen } = useModalStore();

  const handleClose = () => {
    setIsOpen(false);
    setModalId('');
  };

  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === 'changepassword'}
      headerTitle="Change Password"
      type="changepassword-modal"
      close={handleClose}>
      <ChangePasswordForm onDone={handleClose}>
        {isLoading => (
          <button disabled={isLoading} type="submit" className="btn btn-primary">
            Change Password
          </button>
        )}
      </ChangePasswordForm>
    </ModalTitleWrapper>
  );
};
