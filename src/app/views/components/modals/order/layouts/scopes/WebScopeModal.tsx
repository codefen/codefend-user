import { type FC, useEffect, useState } from 'react';
import { useOrderScope } from '@hooks/orders/useOrders';
import { ScopeOption, OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import useTimeout from '#commonHooks/useTimeout.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useGetResources } from '@resourcesHooks/global/useGetResources';
import { getCompanyAllMetrics } from '@utils/metric.service';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { GlobeWebIcon } from '@icons';
import { useNavigate } from 'react-router';
import { OrderErrorMessage } from '@/app/views/components/OrderErrorMessage/OrderErrorMessage';

export const WebScopeModal: FC = () => {
  const { resourceType, updateState, acceptCondition } = useOrderStore(state => state);
  const [acceptConditions, setAcceptCondition] = useState<boolean>(acceptCondition);
  const [tryClick, setTryClick] = useState<boolean>(false);
  const { sendScopeOrders } = useOrderScope();
  const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
  const { getAnyResource } = useGetResources();
  const globalStore = useGlobalFastFields([
    'subDomainCount',
    'uniqueIpCount',
    'domainCount',
    'planPreference',
    'isDefaultPlan',
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    globalStore.isDefaultPlan.set(true);
    const domainCount = globalStore.domainCount.get;

    if (domainCount <= 0) {
      getAnyResource('web').then(res => {
        const metrics = getCompanyAllMetrics(res);
        globalStore.domainCount.set(metrics.domainCount);
        globalStore.subDomainCount.set(metrics.subDomainCount);
        globalStore.uniqueIpCount.set(metrics.uniqueIpCount);
        if (metrics.domainCount <= 2 && metrics.subDomainCount <= 6) {
          globalStore.planPreference.set('small');
        } else if (metrics.domainCount <= 5 && metrics.subDomainCount <= 15) {
          globalStore.planPreference.set('medium');
        } else {
          globalStore.planPreference.set('advanced');
        }
      });
    } else {
      if (globalStore.domainCount.get <= 2 && globalStore.subDomainCount.get <= 6) {
        globalStore.planPreference.set('small');
      } else if (globalStore.domainCount.get <= 5 && globalStore.subDomainCount.get <= 15) {
        globalStore.planPreference.set('medium');
      } else {
        globalStore.planPreference.set('advanced');
      }
    }
  }, [globalStore.planPreference.get, globalStore.domainCount.get]);

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

  const goToNavigate = () => {
    updateState('open', false);
    updateState('orderStepActive', OrderSection.PAYWALL);
    navigate('/web');
  };

  return (
    <div className="step-content scope">
      <div className="step-header">
        <h3 style={{ marginBottom: '0px', paddingBottom: '0px' }}>
          {' '}
          <GlobeWebIcon />
          Web resources
        </h3>
        <p>
          We are about to start a new pentest for all domains defined in your web resources. We have
          detected the following resources:
        </p>
      </div>

      <div className="">
        <div className={`option no-border`}>
          <StatAsset
            isRed
            isActive
            value={globalStore.domainCount.get}
            valueTitle="Top Level Domains"
          />
          <StatAsset value={globalStore.subDomainCount.get} valueTitle="Total Subdomains" />
          <StatAsset value={globalStore.uniqueIpCount.get} valueTitle="Unique IPs" />
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
