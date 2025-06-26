import { type FC } from 'react';

import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import WebDomainForm from '@/app/views/components/forms/WebDomainForm';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';

const AddDomainModal = ({ appEvent }: { appEvent: any }) => {
  const { setIsOpen, isOpen, modalId } = useModalStore();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddDomain = () => {
    appEvent.set(APP_EVENT_TYPE.WEB_RESOURCE_CREATED);
    handleClose();
  };

  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === MODAL_KEY_OPEN.ADD_DOMAIN}
      close={handleClose}
      type="med-w"
      headerTitle="Add web resource">
      <div className="content">
        <WebDomainForm close={handleClose} onDone={handleAddDomain}>
          {isLoading => (
            <ModalButtons
              close={handleClose}
              isDisabled={isLoading}
              confirmText="Add web resource"
            />
          )}
        </WebDomainForm>
      </div>
    </ModalTitleWrapper>
  );
};

export default AddDomainModal;
