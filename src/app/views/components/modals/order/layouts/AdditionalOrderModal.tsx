import { type FC, useCallback, useState } from 'react';
import { PrimaryButton } from '../../..';
import {
  OrderSection,
  OrderTeamSize,
  useOrderStore,
  userOrderProviderInfo,
} from '../../../../../data';

export const AdditionalOrderModal: FC = () => {
  const [aditionalInfoW, setAditionalInfo] = useState('');
  const { updateState, referenceNumber, orderId, teamSize } = useOrderStore(state => state);
  const { sendOrderProviderInfo } = userOrderProviderInfo();

  const placeHolderText = `What is the main reason to conduct this excersive?

Is there any particular resource that requires additional attention?

What's the main concern about security?

Is there any other additional information for our professionals?`;

  const change = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAditionalInfo(e.target.value);
  }, []);
  const continueToPayment = () => {
    updateState('aditionalInfo', aditionalInfoW);
    sendOrderProviderInfo(referenceNumber, aditionalInfoW, orderId);
    updateState('orderStepActive', OrderSection.PAYMENT);
  };
  const backStep = () => {
    if (teamSize === OrderTeamSize.SMALL) {
      updateState('orderStepActive', OrderSection.TEAM_SIZE);
    } else {
      updateState('orderStepActive', OrderSection.ENVIRONMENT);
    }
  };

  return (
    <>
      <div className="step-header">
        <h3>Optionally, would you like to add any notes for the ethical hacker?</h3>
      </div>
      <div className="step-content space">
        <textarea
          name="aditionalInfoW"
          id="aditional-info-order"
          value={aditionalInfoW}
          onChange={change}
          placeholder={placeHolderText}
          cols={82}
          rows={11}></textarea>
      </div>
      <div className="button-wrapper next-btns">
        <div className="secondary-container ">
          <PrimaryButton
            text="back"
            click={backStep}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Next step"
            click={continueToPayment}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </>
  );
};
