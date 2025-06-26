import { type FC } from 'react';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import type { ComponentEventWithOpen } from '@interfaces/util.ts';
import SocialResourceForm from '@/app/views/components/forms/SocialResourceForm';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import useModalStore from '@stores/modal.store';
import Show from '@/app/views/components/Show/Show';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

export const AddSocialResourceModal: FC<ComponentEventWithOpen> = ({ onDone }) => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const closeModal = () => setIsOpen(false);

  const handleDone = () => {
    onDone?.();
    closeModal();
  };

  return (
    <Show when={isOpen && modalId === MODAL_KEY_OPEN.ADD_MEMBER}>
      <ModalTitleWrapper
        close={closeModal}
        isActive={isOpen}
        type="med-w"
        headerTitle="Add a new member">
        <div className="content">
          <SocialResourceForm close={closeModal} onDone={handleDone}>
            {isLoading => (
              <ModalButtons confirmText="Add member" isDisabled={isLoading} close={closeModal} />
            )}
          </SocialResourceForm>
        </div>
      </ModalTitleWrapper>
    </Show>
  );
};

export default AddSocialResourceModal;
