import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useSubscriptionActions } from '@hooks/orders/useSubscriptionActions';
import { ConfirmModal } from '@modals/index';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import useModalStore from '@stores/modal.store';

export const CancelSuscriptionModal = () => {
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const subscriptionSelected = useGlobalFastField('subscriptionSelected');
  const { cancelSubscription } = useSubscriptionActions();

  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === MODAL_KEY_OPEN.CANCEL_SUBSCRIPTION}
      close={() => setIsOpen(false)}
      type="med-w"
      headerTitle="Delete web resource">
      <ConfirmModal
        header={`Are you sure to cancel your subscription?`}
        cancelText="Cancel"
        confirmText="Confirm"
        close={() => setIsOpen(false)}
        action={() => cancelSubscription(subscriptionSelected.get)}
      />
    </ModalTitleWrapper>
  );
};
