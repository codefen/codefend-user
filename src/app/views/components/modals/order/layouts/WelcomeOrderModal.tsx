import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { RememberCard } from '../components/remember/RememberCard.tsx';
import { OrderAlertMessage } from '../components/OrderAlertMessage.tsx';

export const WelcomeOrderModal = ({ close: orderFinished }: { close: () => void }) => {
  return (
    <>
      <img
        src="/util/orders-welcomePuntitos.png"
        className="img-red-neuronal"
        alt="red-img"
        decoding="async"
      />
      <OrderAlertMessage
        imageIcon={<img src="/codefend/fav.png" alt="Codefend logo" />}
        title="Welcome">
        <p>
          <span className="block bolder">Your payment has been successfully processed!</span>
          The selected team has been notified and will start the test as soon as possible.{' '}
          <span className="codefend-text-red underline-high">
            A confirmation email has been sent!
          </span>{' '}
          Please feel free to close this window.
        </p>
      </OrderAlertMessage>
      <RememberCard>
        you'll be always notified by email whenever a new vulnerability or issue is reported!
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
          <PrimaryButton
            text="close"
            click={() => orderFinished()}
            className="full"
            buttonStyle="red"
          />
        </div>
      </div>
    </>
  );
};
