import useTimeout from '#commonHooks/useTimeout';
import { OrderErrorMessage } from '@/app/views/components/OrderErrorMessage/OrderErrorMessage';
import { PrimaryButton } from '@buttons/index';
import { useOrderScope } from '@hooks/index';
import { PeopleGroupIcon } from '@icons';
import { OrderSection } from '@interfaces/order';
import { useGetResources } from '@resourcesHooks/global/useGetResources';
import { useOrderStore } from '@stores/orders.store';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const SocialScopeModal = () => {
  const { resourceType, updateState, acceptCondition } = useOrderStore(state => state);
  const [acceptConditions, setAcceptCondition] = useState<boolean>(acceptCondition);
  const [tryClick, setTryClick] = useState<boolean>(false);
  const { sendScopeOrders } = useOrderScope();
  const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
  const { getAnyResource } = useGetResources();
  const navigate = useNavigate();

  const goToNavigate = () => {
    updateState('open', false);
    updateState('orderStepActive', OrderSection.PAYWALL);
    navigate('/social');
  };

  const nextStep = () => {
    if (acceptConditions) {
      updateState('acceptCondition', acceptConditions);
      sendScopeOrders(resourceType).then((res: any) => {
        updateState('referenceNumber', res?.order.reference_number);
      });
      updateState('orderStepActive', OrderSection.RECOMMENDED_PLAN);
    } else if (!acceptConditions) {
      setTryClick(true);
      oneExecute();
    }
  };

  return (
    <div className="step-content scope">
      <div className="step-header">
        <h3 style={{ marginBottom: '0px', paddingBottom: '0px' }}>
          <PeopleGroupIcon />
          Social resources
        </h3>
        <p>
          We are about to start a new pentest for all ips defined in your network resources. We have
          detected the following resources:
        </p>
      </div>
      <div className="step-content"></div>

      <div className="scope-confirm">
        <input
          id="confirmation"
          type="checkbox"
          alt="checkbox"
          className="codefend-checkbox confirm-check"
          defaultChecked={acceptConditions}
          onChange={() => setAcceptCondition(!acceptConditions)}
        />
        <label htmlFor="confirmation" className="confirm-label">
          <span className="codefend-text-red underline-high disclaimers" title="Open disclaimers">
            I confirm I have authorization
          </span>
          <span>and I’ve read and accept the disclaimer.</span>
        </label>
        <OrderErrorMessage tryClick={tryClick} acceptConditions={acceptConditions} />
      </div>
      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="Edit resources"
            click={goToNavigate}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Continue"
            click={nextStep}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
