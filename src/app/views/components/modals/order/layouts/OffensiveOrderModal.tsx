import { type FC, useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderSection, OrderOffensive } from '@interfaces/order';
import { useOrderOffensive } from '@hooks/orders/useOrders';
import { useOrderStore } from '@stores/orders.store';

export const OffensiveOrderModal: FC = () => {
  const { offensiveOrder, updateState, referenceNumber, orderId } = useOrderStore(state => state);
  const [offensiveOrderW, setOffensiveOrder] = useState<OrderOffensive>(offensiveOrder);
  const { sendOrderProvider } = useOrderOffensive();

  const nextStep = () => {
    if (offensiveOrderW !== OrderOffensive.UNKNOWN) {
      updateState('offensiveOrder', offensiveOrderW);
      sendOrderProvider(referenceNumber, offensiveOrderW, orderId).then((data: any) => {
        if (data.error == 0) {
          updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);
        }
      });
    }
  };

  return (
    <>
      <div className="step-header">
        <h3>Please tell us about the environment. Are the systems in active use?</h3>
      </div>
      <div className="step-content">
        <div
          className={`option order-pointer ${
            offensiveOrderW === OrderOffensive.CAREFUL ? `select-option` : ``
          }`}
          onClick={() => setOffensiveOrder(OrderOffensive.CAREFUL)}>
          <img
            src="/codefend/pentest-careful.png"
            alt="careful-pentest-icon"
            className="step-image environment"
            decoding="async"
            loading="lazy"
          />

          <div className="order-snapshot">
            <div className="top">
              <p className="pentest-option">
                <span className="alt-color space">Careful pentest:</span>
                recommended for production environments.
              </p>
            </div>
            <span className="one-pentest">
              Codefend's professionals will be extra careful and will avoid all possible risk.
            </span>
          </div>
        </div>
        <div
          className={`option order-pointer ${
            offensiveOrderW === OrderOffensive.OFFENSIVE ? `select-option` : ``
          }`}
          onClick={() => setOffensiveOrder(OrderOffensive.OFFENSIVE)}>
          <img
            src="/codefend/pentest-offensive.png"
            alt="offensive-pentest-icon"
            className="step-image environment"
            decoding="async"
            loading="lazy"
          />

          <div className="order-snapshot">
            <div className="top">
              <p className="pentest-option">
                <span className="alt-color space">Offensive pentest:</span>
                recommended for test environment
              </p>
            </div>
            <span className="one-pentest">
              Codefend's professionals may use more disruptive or risky techniques.
            </span>
          </div>
        </div>
        <div
          className={`option order-pointer ${
            offensiveOrderW === OrderOffensive.ADVERSARY && `select-option`
          }`}
          onClick={() => setOffensiveOrder(OrderOffensive.ADVERSARY)}>
          <img
            src="/codefend/pentest-adversary.png"
            alt="adversary-pentest-icon"
            className="step-image environment"
            decoding="async"
            loading="lazy"
          />

          <div className="order-snapshot">
            <div className="top">
              <p className="pentest-option">
                <span className="alt-color space">Adversary simulation:</span>
                ⚠️ could cause stress!
              </p>
            </div>
            <span className="one-pentest">
              Codefend's professionals will use all possible techniques to simulate a real attack.
            </span>
          </div>
        </div>
      </div>
      <div className="button-wrapper next-btns">
        <div className="secondary-container ">
          <PrimaryButton
            text="back"
            click={() => updateState('orderStepActive', OrderSection.TEAM_SIZE)}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Next step"
            click={nextStep}
            className="full"
            buttonStyle="red"
            isDisabled={offensiveOrderW === OrderOffensive.UNKNOWN}
            disabledLoader
          />
        </div>
      </div>
    </>
  );
};
