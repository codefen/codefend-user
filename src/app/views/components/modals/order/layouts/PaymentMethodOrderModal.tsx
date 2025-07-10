import { type FC } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderPaymentMethod, OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { userOrderFinancialResource } from '@hooks/orders/useOrders';
import { usePaymentTelemetry } from '@hooks/common/usePaymentTelemetry';

export const PaymentMethodOrderModal: FC = () => {
  const { updateState, referenceNumber, orderId } = useOrderStore(state => state);
  const { sendOrderFinancial } = userOrderFinancialResource();
  const { trackPaymentMethodSelection } = usePaymentTelemetry();

  const backStep = () => updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);

  const handlePaymentMethodClick = (method: OrderPaymentMethod, telemetryLabel: string) => {
    trackPaymentMethodSelection(telemetryLabel as 'stripe' | 'crypto' | 'bank');
    updateState('paymentMethod', method);
    sendOrderFinancial(referenceNumber, method, orderId);
    updateState('orderStepActive', OrderSection.ANY_PAYMENT_METHOD);
  };

  const closeModal = () => {
    updateState('orderStepActive', OrderSection.PAYWALL);
    updateState('open', false);
  };

  return (
    <div className="step-content payment">
      <button
        className="close-button"
        onClick={closeModal}
        style={{
          position: 'absolute',
          right: '15px',
          top: '15px',
          zIndex: 10,
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: 'var(--tertiary-color-700)',
          transition: 'color 0.3s ease',
        }}>
        ×
      </button>
      
      <div className="step-header">
        <h3>Great! Please select your payment method:</h3>
      </div>
      
      <div className="step-content">
        <div
          className="option-card"
          onClick={() => handlePaymentMethodClick(OrderPaymentMethod.CARD, 'stripe')}>
          <img
            src="/codefend/credit-card.svg"
            alt="Credit Card Icon"
            style={{ width: '80px', height: 'auto' }}
          />
          <div className="order-snapshot">
            <div className="top">
              <p>Credit and debit card payment:</p>
            </div>
            <span className="one-pentest">
              Experience the swiftest payment method available. Initiate your penetration test
              promptly with our secure international card payments.
            </span>
          </div>
        </div>

        <div
          className="option-card"
          onClick={() => handlePaymentMethodClick(OrderPaymentMethod.CRYPTO, 'crypto')}>
          <img
            src="/codefend/btc.svg"
            alt="Cryptocurrency Icon"
            style={{ width: '80px', height: '80px' }}
          />
          <div className="order-snapshot">
            <div className="top">
              <p>Cryptocurrency payment:</p>
            </div>
            <span className="one-pentest">
              Codefend gladly accepts direct cryptocurrency payments in Bitcoin, Ethereum, Litecoin,
              Solana, Monero, and stablecoins like USDC and USDT.
            </span>
          </div>
        </div>

        <div
          className="option-card"
          onClick={() => handlePaymentMethodClick(OrderPaymentMethod.BANK_TRANSFER, 'bank')}>
          <img
            src="/codefend/logo-color.png"
            alt="Bank Transfer Icon"
            style={{ width: '80px', height: '80px' }}
          />
          <div className="order-snapshot">
            <div className="top">
              <p>Bank transfer / bank wire:</p>
            </div>
            <span className="one-pentest">
              Ideal for substantial orders! Verification is required, and confirmation may take up
              to 48 hours after payment receipt.
            </span>
          </div>
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
      </div>
    </div>
  );
};
