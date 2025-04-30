import { AppConstants } from '@/app/constants/app-contanst';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { useOrderPlan } from '@hooks/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';

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
    <div className="step-new-content">
      <div className="step-new-header">
        <h3>
          Plan {isDefaultPlan.get ? 'recomendado' : 'seleccionado'}: {plan.promise}
        </h3>
        <p>Hemos analizado tus recursos y este es el plan que te recomendamos:</p>
      </div>

      <div className="flex-box">
        <div className="flex-box-column">
          <img
            src={`/codefend/${plan.type}-plan.png`}
            width={90}
            height={90}
            alt="recommended-plan"
          />
          <span className="codefend-text-red title-format">{plan.price}</span>
        </div>
        <ul className="plain-list">
          {plan.list.map((item: string, index: number) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </div>
      <p>Te parece que esta bien este plan o queres seleccionar otro?</p>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="see other plans"
            className="full"
            buttonStyle="black"
            disabledLoader
            click={seeOtherPlans}
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
