import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useOrderStore } from '@stores/orders.store.ts';
import { RememberCard } from '../components/remember/RememberCard.tsx';
import { OrderAlertMessage } from '../components/OrderAlertMessage.tsx';

export const PaymentErrorOrderModal = () => {
  const { resetActiveOrder } = useOrderStore(state => state);

  return (
    <>
      <OrderAlertMessage
        imageIcon={
          <img
            src="/util/orders-cp-crash.png"
            alt="Codefend logo"
            decoding="async"
            loading="lazy"
          />
        }
        title="It didn't work!">
        <p>
          <span className="bolder block">It has not been possible to process your payment!</span>
          Please return to the previous screen and select a different payment method. If the problem
          persists,
          <span className="codefend-text-red underline-high">
            please contact your bank to authorize the transaction or update details.
          </span>{' '}
        </p>
      </OrderAlertMessage>
      <RememberCard>
        bank and cryptocurrency payments are also efficient payment methods!
      </RememberCard>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="cancel"
            click={() => {}}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="update payment details"
            click={() => resetActiveOrder()}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </>
  );
};
