import { type FC } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import type { ComponentEventWithOpen } from '@interfaces/util.ts';
import SocialResourceForm from '@/app/views/components/forms/SocialResourceForm';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';

export const AddSocialResourceModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    close={() => close?.()}
    isActive={isOpen}
    type="med-w"
    headerTitle="Add a new member">
    <div className="content">
      <SocialResourceForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons confirmText="Add member" isDisabled={isLoading} close={() => close?.()} />
        )}
      </SocialResourceForm>
    </div>
  </ModalTitleWrapper>
);

export default AddSocialResourceModal;
