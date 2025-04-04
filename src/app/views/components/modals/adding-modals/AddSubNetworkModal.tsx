import type { FC } from 'react';
import type { Device } from '@interfaces/panel';
import type { ComponentEventWithOpen } from '@interfaces/util';
import SubNetworkForm from '@/app/views/components/forms/SubNetworkForm';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';

interface AddSubNetworkModalProps extends ComponentEventWithOpen {
  internalNetwork: Device[];
}

export const AddSubNetworkModal: FC<AddSubNetworkModalProps> = ({
  close,
  onDone,
  internalNetwork,
  isOpen,
}) => {
  return (
    <ModalTitleWrapper
      headerTitle="Add network device"
      type="med-w"
      close={() => close?.()}
      isActive={isOpen}>
      <div className="content">
        <SubNetworkForm internalNetwork={internalNetwork} close={close} onDone={onDone}>
          {isLoading => (
            <ModalButtons
              close={() => close?.()}
              confirmText="Add access point"
              isDisabled={isLoading}
            />
          )}
        </SubNetworkForm>
      </div>
    </ModalTitleWrapper>
  );
};
