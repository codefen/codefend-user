import { type FC } from 'react';
import { type ComponentEventWithOpen, type Device } from '../../../../data';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import SubNetworkForm from '@/app/views/components/forms/SubNetworkForm';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';

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
