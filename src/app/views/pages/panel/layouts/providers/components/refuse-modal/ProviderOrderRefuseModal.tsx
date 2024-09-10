import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import Show from '@defaults/Show.tsx';
import { useProviderRefuseStore } from '@stores/providerOrder.store';
import { OrderRejectionForm } from '@modals/OrderRejectionForm';
import './refusemodal.scss';

export const ProviderOrderRefuseModal = () => {
  const { openRefuse, openReasonReject, setOpenReasonReject, allClose } = useProviderRefuseStore();

  return (
    <ModalTitleWrapper
      isActive={openRefuse || openReasonReject}
      close={allClose}
      headerTitle="Refuse order">
      <>
        <Show when={openRefuse}>
          <ConfirmModal
            header="Are you sure you want to refuse this order?"
            cancelText="Cancel"
            confirmText="Confirm"
            close={allClose}
            action={() => setOpenReasonReject(true)}
          />
        </Show>

        {openReasonReject && <OrderRejectionForm />}
      </>
    </ModalTitleWrapper>
  );
};
