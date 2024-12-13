import { type FC } from 'react';

import { ModalButtons, ModalTitleWrapper } from '../..';
import { NetworkDadForm } from '@/app/views/components/forms/NetworkDadForm';
import type { ComponentEventWithOpen } from '@interfaces/util';

export const AccessPointModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    headerTitle="Add access point"
    type="med-w"
    close={() => close?.()}
    isActive={isOpen}>
    <div className="content">
      <NetworkDadForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons
            confirmText="Add access point"
            isDisabled={isLoading}
            close={() => close?.()}
          />
        )}
      </NetworkDadForm>
    </div>
  </ModalTitleWrapper>
);

export default AccessPointModal;
