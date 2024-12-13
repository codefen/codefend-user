import { type FC } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import SupportTicketForm from '@/app/views/components/forms/SupportTicketForm';
import type { ComponentEventWithOpen } from '@interfaces/util';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';

export const AddTicketModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    headerTitle="Add ticket"
    close={() => close?.()}
    isActive={isOpen}
    type="med-w">
    <div className="content">
      <SupportTicketForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons isDisabled={isLoading} close={() => close?.()} confirmText="Add ticket" />
        )}
      </SupportTicketForm>
    </div>
  </ModalTitleWrapper>
);
