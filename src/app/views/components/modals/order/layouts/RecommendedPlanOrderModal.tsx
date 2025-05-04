import { AppConstants } from '@/app/constants/app-contanst';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { useOrderPlan } from '@hooks/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';
import { GlobeWebIcon } from '@icons';

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

  return (
    <div className="step-content plan">
      <div className="step-header">
        <h3><GlobeWebIcon /> 
          {isDefaultPlan.get ? 'Recommended plan' : 'Selected plan'}:{' '}
          {plan.promise === 'analisis unico avanzado'
            ? 'advanced one-time analysis'
            : plan.promise === 'analisis unico intermedio'
              ? 'intermediate one-time analysis'
              : plan.promise === 'analisis unico pequeño'
                ? 'basic one-time analysis'
                : plan.promise}
        </h3>
        <p>We have analyzed your resources and this is the plan we recommend:</p>
      </div>

      <div className="flex-box">
        <div className="flex-box-column">
          <img
            src={`/codefend/${plan.type}-plan.png`}
            width={90}
            height={90}
            alt="recommended-plan"
          />
          <span className="codefend-text-red title-format price">{plan.price}</span>
        </div>
        <ul className="plan-list">
          {plan.list.map((item: string, index: number) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{
                __html: item
              }}
            />
          ))}
        </ul>
      </div>
      <p className='ending'>Do you think this plan is right for you or do you want to <a onClick={seeOtherPlans}>select another one</a>?</p>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
        <PrimaryButton
            text="Back"
            click={() => updateState('orderStepActive', OrderSection.SCOPE)}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
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
