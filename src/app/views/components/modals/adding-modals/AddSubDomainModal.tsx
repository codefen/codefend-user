import { type FC } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { type Webresource } from '@interfaces/panel.ts';
import ModalTitleWrapper from '@/app/components/modalwrapper/ModalTitleWrapper.tsx';
import SubDomainForm from '@/app/views/components/forms/SubDomainForm.tsx';
import type { ComponentEventWithOpen } from '@interfaces/util.ts';

interface AddSubDomainModalProps extends ComponentEventWithOpen {
  webResources: Webresource[];
}

const AddSubDomainModal: FC<AddSubDomainModalProps> = ({ close, onDone, webResources, isOpen }) => (
  <ModalTitleWrapper
    isActive={isOpen}
    close={() => close?.()}
    type="med-w"
    headerTitle="Add web sub-resource">
    <div className="content subdomain-modal">
      <SubDomainForm close={close} onDone={onDone} webResources={webResources}>
        {isLoading => (
          <ModalButtons close={close!} isDisabled={isLoading} confirmText="Add web resource" />
        )}
      </SubDomainForm>
    </div>
  </ModalTitleWrapper>
);

export default AddSubDomainModal;
