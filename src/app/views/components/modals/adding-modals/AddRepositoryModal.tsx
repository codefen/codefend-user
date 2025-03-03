import { type FC } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import type { ComponentEventWithOpen } from '@interfaces/util';
import ModalTitleWrapper from '@/app/components/modalwrapper/ModalTitleWrapper';
import { SourceResourceForm } from '@/app/components/forms/SourceResourceForm';

export const AddRepositoryModal: FC<ComponentEventWithOpen> = ({ isOpen, close, onDone }) => (
  <ModalTitleWrapper
    headerTitle="Add repository"
    type="med-w"
    close={() => close?.()}
    isActive={isOpen}>
    <div className="content">
      <SourceResourceForm close={close} onDone={onDone}>
        {isLoading => (
          <ModalButtons
            confirmText="Add source code"
            isDisabled={isLoading}
            close={() => close?.()}
          />
        )}
      </SourceResourceForm>
    </div>
  </ModalTitleWrapper>
);
