import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useOrderStore } from '@stores/orders.store.ts';
import { RememberCard } from '../components/remember/RememberCard.tsx';
import { OrderAlertMessage } from '../components/OrderAlertMessage.tsx';
import { userOrderFnished } from '@hooks/useOrders.ts';

export const WaitingCheckOrderModal = () => {
  const { resetActiveOrder, referenceNumber, orderId } = useOrderStore(state => state);
  const finishOrder = userOrderFnished();
  const orderFinished = () => {
    finishOrder(referenceNumber, orderId);
    resetActiveOrder();
  };

  return (
    <>
      <OrderAlertMessage
        imageIcon={
          <img src="/util/orders-clock.png" alt="Codefend logo" decoding="async" loading="lazy" />
        }
        title="Await for confirmation">
        <p>
          <span className="bolder block">
            Your penetration testing request has been successfully submitted.
          </span>
          A codefend representative will contact you via email within the next 24-48 hours to
          discuss details and next steps.
        </p>
      </OrderAlertMessage>
      <RememberCard>
        bank and cryptocurrency payments are also efficient payment methods!
      </RememberCard>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text=""
            click={() => {}}
            className="full order-default bg-transparent"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton text="close" click={orderFinished} className="full" buttonStyle="red" />
        </div>
      </div>
    </>
  );
};
