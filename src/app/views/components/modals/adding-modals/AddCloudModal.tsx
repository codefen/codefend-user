import { type FC } from 'react';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import type { ComponentEventWithOpen } from '@interfaces/util';
import { CloudResourceForm } from '@/app/views/components/forms/CloudResourceForm';

export const AddCloudModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper headerTitle="Add Cloud" close={() => close?.()} isActive={isOpen} type="med-w">
    <div className="content">
      <CloudResourceForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons
            confirmText="Add cloud app"
            isDisabled={isLoading}
            close={() => close?.()}
          />
        )}
      </CloudResourceForm>
    </div>
  </ModalTitleWrapper>
);
