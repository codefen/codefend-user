import { type FC, useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderFrequency, OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useOrderMembership } from '@hooks/orders/useOrders';

export const FrequencyOrderModal: FC = () => {
  const { frequency, updateState, referenceNumber, orderId } = useOrderStore(state => state);

  const [frequencyW, setFrequency] = useState<OrderFrequency>(frequency);
  const { sendMemberShip } = useOrderMembership();

  const nextStep = () => {
    if (referenceNumber && frequencyW !== OrderFrequency.UNKNOWN) {
      updateState('frequency', frequencyW);
      sendMemberShip(frequencyW, referenceNumber, orderId);
      updateState('orderStepActive', OrderSection.TEAM_SIZE);
    }
  };

  return (
    <>
      <div className="step-header">
        <h3>
          <span>Select between one unique pentest or our exclusive subscription!</span>
        </h3>
      </div>
      <div className="step-content">
        <div
          className={`option order-pointer ${
            frequencyW === OrderFrequency.ONCE && `select-option`
          }`}
          onClick={() => setFrequency(OrderFrequency.ONCE)}>
          <img
            src="/codefend/order-frequency1.svg"
            alt="fast-pentest-icon"
            className="step-image"
            decoding="async"
            loading="lazy"
          />

          <div className="order-snapshot">
            <div className="top">
              <p className="pentest-option">
                <span className="alt-color space">Snapshot pentest:</span> recommended for an
                initial review of the resources.
              </p>
            </div>
            <span className="one-pentest">
              Fully printable reports, & support to fix all vulnerabilities. Delivery 4 weeks or
              less!
            </span>
          </div>
        </div>
        <div
          className={`option order-pointer ${
            frequencyW === OrderFrequency.MEMBER_SHIP && `select-option`
          }`}
          onClick={() => setFrequency(OrderFrequency.MEMBER_SHIP)}>
          <img
            src="/codefend/order-frequency2.svg"
            alt="large-pentest-icon"
            className="step-image"
          />

          <div className="order-snapshot">
            <div className="top">
              <p className="pentest-option">
                <span className="alt-color space">Permanent surveillance:</span>
                keep your assets secure and keep aside of risk!
              </p>
            </div>
            <span className="one-pentest">
              Stay ahead of exploits, data-leaks and hackers with our 12 months subscription.
            </span>
          </div>
        </div>
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="Back"
            click={(e: any) => updateState('orderStepActive', OrderSection.SCOPE)}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            isDisabled={frequencyW === OrderFrequency.UNKNOWN}
            disabledLoader
            text="Next step"
            click={nextStep}
            className="full"
            buttonStyle="red"
          />
        </div>
      </div>
    </>
  );
};
