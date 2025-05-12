import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderSection, OrderTeamSize } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useOrderSaveBank } from '@hooks/orders/useOrders';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const BankPaymentModal = () => {
  const { teamSize, updateState, referenceNumber, orderId } = useOrderStore(state => state);
  const [transactionID, { setTransactionID, saveBankPayment }] = useOrderSaveBank();
  const stored = useGlobalFastField('planPreference');

  const BankInfo = (props: any) => {
    return (
      <p>
        <span className="codefend-text-red underline-high space">{props.keyV}</span> {props.value}
      </p>
    );
  };

  const backStep = () => {
    updateState('orderStepActive', OrderSection.PAYMENT);
  };
  const finishStep = () => {
    if (!transactionID) return;
    saveBankPayment(referenceNumber, transactionID, orderId).finally(() =>
      updateState('orderStepActive', OrderSection.WAIT_CHECK)
    );
    setTransactionID('');
  };

  const finalPrice = () => {
    if (teamSize === OrderTeamSize.SMALL || stored.get === OrderTeamSize.SMALL) return '$1,500';
    if (teamSize === OrderTeamSize.MID || stored.get === OrderTeamSize.MID) return '$4,500';
    return '$13,500';
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h3>Please proceed with the transaction and complete with the details:</h3>
      </div>
      <div className="step-content bank-payment">
        <div className="payment-bank-options show-bottom-border">
          <div className="payment-bank">
            <div className="top">
              <p>Receiving Bank</p>
            </div>

            <BankInfo keyV="SWIFT / BIC CODE:" value="CHFGUS44021" />
            <BankInfo keyV="ABA Routing Number:" value="091311229" />
            <BankInfo keyV="Bank Name:" value="Choice Financial Group" />
            <BankInfo keyV="Bank Address:" value="4501 23rd Avenue S Fargo, ND 58104, USA" />
          </div>
          <div className="payment-bank show-left-border">
            <div className="top">
              <p>Beneficiary</p>
            </div>

            <BankInfo keyV="IBAN / Account Number:" value="202399538882" />
            <BankInfo keyV="Beneficiary Name:" value="Codefend LLC" />
            <BankInfo
              keyV="Beneficiary Address:"
              value="651 N Broad St, Suite 201 Middletown DE 19709 USA"
            />
          </div>
        </div>

        <div className="bank-payment-options show-bottom-border">
          <div className="total-payment-option">
            <span>Total to be paid in USD</span>
            <span>{finalPrice()}</span>
          </div>
          <div className="bank-transfer-input">
            <input
              type="text"
              placeholder="Transaction Id"
              autoComplete="off"
              onChange={e => setTransactionID(e.target.value)}
            />
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
        <div className="primary-container">
          <PrimaryButton
            text="I have made the payment"
            click={finishStep}
            className="full"
            buttonStyle="red"
            isDisabled={transactionID.trim() === ''}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
