import { type FC, useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderPaymentMethod, OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { userOrderFinancialResource } from '@hooks/useOrders';

export const PaymentMethodOrderModal: FC = () => {
  const { paymentMethod, updateState, referenceNumber, orderId } = useOrderStore(state => state);
  const { sendOrderFinancial } = userOrderFinancialResource();

  const [paymentMethodW, setPaymentMethod] = useState<OrderPaymentMethod>(paymentMethod);

  const backStep = () => updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);

  const nextStep = () => {
    if (paymentMethodW !== OrderPaymentMethod.UNKNOWN) {
      updateState('paymentMethod', paymentMethodW);
      sendOrderFinancial(referenceNumber, paymentMethodW, orderId);
      updateState('orderStepActive', OrderSection.WAIT_CHECK);
    }
  };

  return (
    <>
      <div className="step-header">
        <h3>
          <b>Great!</b> Please select your payment method:
        </h3>
      </div>
      <div className="step-content">
        <div
          className={`option ${paymentMethodW === OrderPaymentMethod.CARD ? 'select-option' : ''}`}
          onClick={() => setPaymentMethod(OrderPaymentMethod.CARD)}>
          <input
            id="card"
            type="radio"
            name="payment-methods"
            className="radio-option"
            value={paymentMethodW}
            checked={paymentMethodW === OrderPaymentMethod.CARD}
            defaultChecked={paymentMethodW === OrderPaymentMethod.CARD}
            onChange={() => {}}
            required
          />
          <div className="codefend-radio"></div>
          <label htmlFor="card" className="order-snapshot">
            <div className="top">
              <p className="codefend-color">Credit and debit card payment:</p>
            </div>
            <span className="one-pentest">
              Experience the swiftest payment method available. Initiate your penetration test
              promptly with our secure international card payments.
            </span>
          </label>
        </div>

        <div
          className={`option ${paymentMethodW === OrderPaymentMethod.CRYPTO ? 'select-option' : ''}`}
          onClick={() => setPaymentMethod(OrderPaymentMethod.CRYPTO)}>
          <input
            id="crypto"
            type="radio"
            name="payment-methods"
            className="radio-option"
            checked={paymentMethodW === OrderPaymentMethod.CRYPTO}
            defaultChecked={paymentMethodW === OrderPaymentMethod.CRYPTO}
            value={paymentMethodW}
            onChange={() => {}}
            required
          />
          <div className="codefend-radio"></div>
          <label htmlFor="crypto" className="order-snapshot">
            <div className="top">
              <p className="codefend-color">Cryptocurrency payment:</p>
            </div>
            <span className="one-pentest">
              Codefend gladly accepts direct cryptocurrency payments in Bitcoin, Ethereum, Litecoin,
              Solana, Monero, and stablecoins like USDC and USDT.
            </span>
          </label>
        </div>

        <div
          className={`option ${paymentMethodW === OrderPaymentMethod.BANK_TRANSFER ? 'select-option' : ''}`}
          onClick={() => setPaymentMethod(OrderPaymentMethod.BANK_TRANSFER)}>
          <input
            id="bank-transfer"
            type="radio"
            name="payment-methods"
            className="radio-option"
            value={paymentMethodW}
            checked={paymentMethodW === OrderPaymentMethod.BANK_TRANSFER}
            defaultChecked={paymentMethodW === OrderPaymentMethod.BANK_TRANSFER}
            onChange={() => {}}
            required
          />
          <div className="codefend-radio"></div>
          <label htmlFor="bank-transfer" className="order-snapshot">
            <div className="top">
              <p className="codefend-color">Bank transfer / bank wire:</p>
            </div>
            <span className="one-pentest">
              Ideal for substantial orders! Verification is required, and confirmation may take up
              to 48 hours after payment receipt.
            </span>
          </label>
        </div>
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="Back"
            click={backStep}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Send request"
            click={nextStep}
            className="full"
            buttonStyle="red"
            isDisabled={paymentMethodW === OrderPaymentMethod.UNKNOWN}
            disabledLoader
          />
        </div>
      </div>
    </>
  );
};
