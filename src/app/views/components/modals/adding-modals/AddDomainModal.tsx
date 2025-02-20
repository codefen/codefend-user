import { type FC } from 'react';

import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import ModalTitleWrapper from '@/app/components/modalwrapper/ModalTitleWrapper';
import type { ComponentEventWithOpen } from '@interfaces/util';
import WebDomainForm from '@/app/views/components/forms/WebDomainForm';

const AddDomainModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    isActive={isOpen}
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
