import { AppConstants } from '@/app/constants/app-contanst';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { useOrderPlan } from '@hooks/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';
import { GlobeWebIcon } from '@icons';
import { ResourcePlanImage } from '@modals/order/components/ResourcePlanImage';

export const RecommendedPlanOrderModal = () => {
  const { updateState, referenceNumber, orderId, resourceType } = useOrderStore(state => state);
  const { planPreference, isDefaultPlan } = useGlobalFastFields([
    'planPreference',
    'isDefaultPlan',
  ]);
  const [plan, setPlan] = useState<any>(
    AppConstants.PLAN_PREFERENCE_MAP[resourceType][planPreference.get]
  );
  const { sendPlanTeamSize } = useOrderPlan();
  //const { teamSize, updateState, referenceNumber, orderId } = useOrderStore(state => state);

  useEffect(() => {
    const resourcePlan = AppConstants.PLAN_PREFERENCE_MAP[resourceType];
    setPlan(resourcePlan[planPreference.get]);
  }, [planPreference.get]);

  const seeOtherPlans = () => {
    updateState('orderStepActive', OrderSection.ALL_PLANS);
  };

  const continueWithPlan = () => {
    const selectedPlan = planPreference.get === 'advanced' ? 'full' : planPreference.get;
    updateState('orderStepActive', OrderSection.ENVIRONMENT);
    sendPlanTeamSize(selectedPlan, plan.price, referenceNumber, orderId);
  };

  const handleClose = () => {
    // Cerrar el modal o volver al paso anterior según sea necesario
    const resource = {
      [ResourcesTypes.WEB]: OrderSection.WEB_SCOPE,
      [ResourcesTypes.MOBILE]: OrderSection.MOBILE_SCOPE,
      [ResourcesTypes.NETWORK]: OrderSection.NETWORK_SCOPE,
      [ResourcesTypes.SOCIAL]: OrderSection.SOCIAL_SCOPE,
      [ResourcesTypes.CLOUD]: OrderSection.SCOPE,
      [ResourcesTypes.CODE]: OrderSection.SCOPE,
      [ResourcesTypes.LEAKS]: OrderSection.SCOPE,
    };
    updateState('orderStepActive', resource[resourceType] as OrderSection);
  };

  return (
    <div className="step-content plan" style={{ position: 'relative' }}>
      <button 
        className="close-button"
        onClick={handleClose}
        style={{
          position: 'absolute',
          right: '15px',
          top: '15px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          zIndex: 10,
        }}
      >
        ×
      </button>
      
      <div className="step-header">
        <h3>
          {/* <GlobeWebIcon /> */}
          {isDefaultPlan.get ? 'Recommended plan' : 'Selected plan'}: {plan.promise}
        </h3>
        <p>
          We have analyzed your resources and this is the plan we{' '}
          {isDefaultPlan.get ? 'recommended' : 'selected'}:
        </p>
      </div>

      <div 
        className="flex-box-row clickable-plan"
        onClick={continueWithPlan}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex-box-column">
          <ResourcePlanImage plan={plan.type} resourceType={resourceType} />
          <span className="codefend-text-red title-format price">${plan.price}</span>
        </div>
        <ul className="plan-list">
          {plan.list.map((item: string, index: number) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{
                __html: item,
              }}
            />
          ))}
        </ul>
      </div>
      <p className="ending">
        Do you think this plan is right for you or do you want to{' '}
        <a onClick={seeOtherPlans}>select another one</a>?
      </p>

      <div className="button-wrapper next-btns">
        <div className="primary-container" style={{ margin: '0 auto' }}>
          <PrimaryButton
            text="Continue"
            click={continueWithPlan}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
