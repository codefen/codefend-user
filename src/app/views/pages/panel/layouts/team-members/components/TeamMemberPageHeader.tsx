import { PrimaryButton } from '@buttons/index';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

export const AddCollaboratorAction = () => {
  const { setIsOpen, setModalId } = useModalStore();
  return (
    <PrimaryButton
      text="Add collaborator"
      buttonStyle="red"
      click={() => {
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
      }}
    />
  );
};
