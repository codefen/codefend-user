import useTimeout from '#commonHooks/useTimeout';
import { OrderErrorMessage } from '@/app/views/components/OrderErrorMessage/OrderErrorMessage';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { useOrderScope } from '@hooks/index';
import { LanIcon } from '@icons';
import { OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export const NetworkScopeModal = () => {
  const { resourceType, updateState, acceptCondition } = useOrderStore(state => state);
  const [acceptConditions, setAcceptCondition] = useState<boolean>(acceptCondition);
  const [tryClick, setTryClick] = useState<boolean>(false);
  const { sendScopeOrders } = useOrderScope();
  const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
  const navigate = useNavigate();
  const globalStore = useGlobalFastFields([
    'externalIpCount',
    'internalIpCount',
    'totalNetowrkElements',
    'planPreference',
    'isDefaultPlan',
    'totalNotUniqueIpCount',
  ]);

  const goToNavigate = () => {
    updateState('open', false);
    updateState('orderStepActive', OrderSection.PAYWALL);
    navigate('/network');
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

  useEffect(() => {
    globalStore.isDefaultPlan.set(true);
    if (globalStore.totalNetowrkElements.get <= 20) {
      globalStore.planPreference.set('small');
    } else if (globalStore.totalNetowrkElements.get <= 200) {
      globalStore.planPreference.set('medium');
    } else {
      globalStore.planPreference.set('advanced');
    }
  }, [globalStore.planPreference.get, globalStore.totalNetowrkElements.get]);

  return (
    <div className="step-content scope">
      <div className="step-header">
        <h3 style={{ marginBottom: '0px', paddingBottom: '0px' }}>
          <LanIcon />
          Network resources
        </h3>
        <p>
          We are about to start a new pentest for all ips defined in your network resources. We have
          detected the following resources:
        </p>
      </div>
      <div className="">
        <div className={`option no-border`}>
          <StatAsset value={globalStore.externalIpCount.get} valueTitle="External IPs" />
          <StatAsset value={globalStore.internalIpCount.get} valueTitle="Internal IPs" />
          <StatAsset value={globalStore.totalNotUniqueIpCount.get} valueTitle="Total IPs" />
        </div>
      </div>

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
          <span 
            className={`disclaimers ${tryClick && !acceptConditions ? 'error' : ''}`}
            title="Open disclaimers"
          >
            I have authorization and I accept the terms and conditions{tryClick && !acceptConditions ? ' ⚠️' : ''}
          </span>
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
