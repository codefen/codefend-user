import { type FC } from 'react';

import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import { NetworkDadForm } from '@/app/views/components/forms/NetworkDadForm';
import type { ComponentEventWithOpen } from '@interfaces/util';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import Show from '@/app/views/components/Show/Show';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { APP_EVENT_TYPE } from '@interfaces/panel';

export const AccessPointModal: FC<{ appEvent: any }> = ({ appEvent }) => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const closeModal = () => setIsOpen(false);

  const handleDone = () => {
    appEvent.set(APP_EVENT_TYPE.NETWORK_RESOURCE_CREATED);
    closeModal();
  };

  return (
    <Show when={isOpen && modalId === MODAL_KEY_OPEN.ADD_NETWORK}>
      <ModalTitleWrapper
        headerTitle="Add access point"
        type="med-w"
        close={closeModal}
        isActive={isOpen}>
        <div className="content">
          <NetworkDadForm close={closeModal} onDone={handleDone}>
            {isLoading => (
              <ModalButtons
                confirmText="Add access point"
                isDisabled={isLoading}
                close={closeModal}
              />
            )}
          </NetworkDadForm>
        </div>
      </ModalTitleWrapper>
    </Show>
  );
};

export default AccessPointModal;
