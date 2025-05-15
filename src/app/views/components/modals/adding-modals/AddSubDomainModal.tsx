import { type FC } from 'react';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import { APP_EVENT_TYPE, type Webresource } from '@interfaces/panel.ts';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import SubDomainForm from '@/app/views/components/forms/SubDomainForm.tsx';
import type { ComponentEventWithOpen } from '@interfaces/util.ts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

interface AddSubDomainModalProps extends ComponentEventWithOpen {
  webResources: Webresource[];
}

const AddSubDomainModal: FC<AddSubDomainModalProps> = ({ webResources }) => {
  const { setIsOpen, isOpen, modalId } = useModalStore();
  const appEvent = useGlobalFastField('appEvent');

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddSubDomain = () => {
    appEvent.set(APP_EVENT_TYPE.WEB_RESOURCE_CREATED);
    handleClose();
  };

  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === MODAL_KEY_OPEN.ADD_SUB_DOMAIN}
      close={handleClose}
      type="med-w"
      headerTitle="Add web sub-resource">
      <div className="content subdomain-modal">
        <SubDomainForm close={handleClose} onDone={handleAddSubDomain} webResources={webResources}>
          {isLoading => (
            <ModalButtons
              close={handleClose}
              isDisabled={isLoading}
              confirmText="Add web resource"
            />
          )}
        </SubDomainForm>
      </div>
    </ModalTitleWrapper>
  );
};

export default AddSubDomainModal;
