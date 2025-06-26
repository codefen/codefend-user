import { type FC } from 'react';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import MobileResourceForm from '@/app/views/components/forms/MobileResourceForm';
import type { ComponentEventWithOpen } from '@interfaces/util';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';

const AddMobileModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    headerTitle="Add mobile app"
    close={() => close?.()}
    isActive={isOpen ?? false}
    type="med-w">
    <div className="content">
      <MobileResourceForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons
            confirmText="Add mobile app"
            isDisabled={isLoading}
            close={() => close?.()}
          />
        )}
      </MobileResourceForm>
    </div>
  </ModalTitleWrapper>
);

export default AddMobileModal;
