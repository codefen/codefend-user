import { type FC } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderPaymentMethod, OrderSection, UserSmallPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { userOrderFinancialResource } from '@hooks/orders/useOrders';
import { usePaymentTelemetry } from '@hooks/common/usePaymentTelemetry';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const PaymentMethodOrderModal: FC = () => {
  const { updateState, referenceNumber, orderId, userSmallPlanSelected } = useOrderStore(
    state => state
  );
  const planPreference = useGlobalFastField('planPreference');
  const { sendOrderFinancial } = userOrderFinancialResource();
  const { trackPaymentMethodSelection } = usePaymentTelemetry();
  const backStep = () => updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);

  // Función para obtener el valor del plan seleccionado
  const getPlanValue = (): number => {
    // Para planes pequeños (automated web scan)
    if (userSmallPlanSelected) {
      const smallPlanPrices: Record<string, number> = {
        [UserSmallPlanSelected.BASIC]: 29,
        [UserSmallPlanSelected.MEDIUM]: 59,
        [UserSmallPlanSelected.ADVANCED]: 89,
      };
      return smallPlanPrices[userSmallPlanSelected] || 0;
    }

    // Para planes profesionales (pentest on demand)
    if (planPreference.get) {
      const professionalPlanPrices: Record<string, number> = {
        small: 1500,
        medium: 4500,
        advanced: 13500,
      };
      return professionalPlanPrices[planPreference.get] || 0;
    }

    return 0;
  };

  const handlePaymentMethodClick = (method: OrderPaymentMethod, telemetryLabel: string) => {
    const planValue = getPlanValue();
    trackPaymentMethodSelection(telemetryLabel as 'stripe' | 'crypto' | 'bank', planValue);
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

      <div className="pay-methods">
        <div
          className="option-card"
          onClick={() => handlePaymentMethodClick(OrderPaymentMethod.CARD, 'stripe')}>
          <span className="pay-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="2.5" y="5" width="19" height="14" rx="2" />
              <path d="M2.5 9.5h19" />
            </svg>
          </span>
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
          <span className="pay-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M10 8.2h3.2a1.8 1.8 0 0 1 0 3.6H10zM10 11.8h3.6a1.8 1.8 0 0 1 0 3.6H10zM11.2 6.8v10.4M13.2 6.8v10.4" />
            </svg>
          </span>
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
          <span className="pay-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 10.5 12 5l8 5.5" />
              <path d="M6 10.5V18M10 10.5V18M14 10.5V18M18 10.5V18" />
              <path d="M4 18h16" />
            </svg>
          </span>
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
