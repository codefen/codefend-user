import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import useModalStore from '@stores/modal.store.ts';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import CollaboratorForm from '@/app/views/components/forms/CollaboratorForm.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';

export const AddCollaboratorModal = () => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  return (
    <ModalTitleWrapper
      close={() => setIsOpen(false)}
      type="med-w"
      isActive={isOpen && modalId === MODAL_KEY_OPEN.ADD_COLLABORATOR}
      headerTitle="Add collaborator">
      <div className="content">
        <CollaboratorForm>
          {isLoading => (
            <ModalButtons
              close={() => setIsOpen(false)}
              isDisabled={isLoading}
              confirmText="Add collaborator"
            />
          )}
        </CollaboratorForm>
      </div>
    </ModalTitleWrapper>
  );
};
