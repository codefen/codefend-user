import type { FC } from 'react';
import type { Device } from '@interfaces/panel';
import type { ComponentEventWithOpen } from '@interfaces/util';
import SubNetworkForm from '@/app/views/components/forms/SubNetworkForm';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';

interface AddSubNetworkModalProps extends ComponentEventWithOpen {
  internalNetwork: Device[];
}

export const AddSubNetworkModal: FC<AddSubNetworkModalProps> = ({ onDone, internalNetwork }) => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const closeModal = () => setIsOpen(false);

  const handleDone = () => {
    onDone?.();
    closeModal();
  };

  return (
    <Show when={isOpen && modalId === MODAL_KEY_OPEN.ADD_SUB_NETWORK}>
      <ModalTitleWrapper
        headerTitle="Add network device"
        type="med-w"
        close={closeModal}
        isActive={isOpen}>
        <div className="content">
          <SubNetworkForm internalNetwork={internalNetwork} close={closeModal} onDone={handleDone}>
            {isLoading => (
              <ModalButtons
                close={closeModal}
                confirmText="Add access point"
                isDisabled={isLoading}
              />
            )}
          </SubNetworkForm>
        </div>
      </ModalTitleWrapper>
    </Show>
  );
};
