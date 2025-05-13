import { type FC } from 'react';

import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import type { ComponentEventWithOpen } from '@interfaces/util';
import WebDomainForm from '@/app/views/components/forms/WebDomainForm';

const AddDomainModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    isActive={isOpen ?? false}
    close={() => close?.()}
    type="med-w"
    headerTitle="Add web resource">
    <div className="content">
      <WebDomainForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons close={close!} isDisabled={isLoading} confirmText="Add web resource" />
        )}
      </WebDomainForm>
    </div>
  </ModalTitleWrapper>
);

export default AddDomainModal;
