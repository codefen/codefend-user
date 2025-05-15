import { AppConstants } from '@/app/constants/app-contanst';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection } from '@interfaces/order';
import { ResourcePlanImage } from '@modals/order/components/ResourcePlanImage';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';

const VISIBLE_PLANS = ['small', 'medium', 'advanced'];

export const AllPlansOrderModal = () => {
  const store = useGlobalFastFields(['planPreference', 'isDefaultPlan']);
  const { updateState, resourceType } = useOrderStore(state => state);
  const [plans, setPlans] = useState<any>(
    Object.entries(AppConstants.PLAN_PREFERENCE_MAP[resourceType]).filter(([key, plan]) =>
      VISIBLE_PLANS.includes(key)
    )
  );

  useEffect(() => {
    setPlans(
      Object.entries(AppConstants.PLAN_PREFERENCE_MAP[resourceType]).filter(([key, plan]) =>
        VISIBLE_PLANS.includes(key)
      )
    );
  }, [resourceType]);

  const changed = (type: 'small' | 'medium' | 'advanced') => {
    store.planPreference.set(type);
    store.isDefaultPlan.set(false);
  };

  const closeModal = () => {
    updateState('orderStepActive', OrderSection.PAYWALL);
    updateState('open', false);
  };

  const goToSelectPlan = () => {
    updateState('orderStepActive', OrderSection.RECOMMENDED_PLAN);
  };

  return (
    <div
      className="step-content plan"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="step-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <img
            src="/codefend/estrellitas.png"
            alt="estrellas"
            style={{ height: '35px', width: 'auto', display: 'block' }}
          />
          <h3 style={{ margin: 0 }}>Professional hackers & Pentest on demand</h3>
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: AppConstants.PLAN_PREFERENCE_MAP[resourceType].planTitle,
          }}
        />
      </div>
      <div
        className="plans-cards-wrapper"
        style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
        {plans.map(([key, plan]: any) => (
          <label
            key={`plan-key-${plan.type}`}
            className={`plan-card-auto${store.planPreference.get === plan.type ? ' selected' : ''}`}
            data-plan={plan.type}
            htmlFor={`plan-input-${plan.type}`}>
            <input
              type="radio"
              name="plan"
              id={`plan-input-${plan.type}`}
              checked={store.planPreference.get === plan.type}
              onChange={() => changed(plan.type)}
              style={{ display: 'none' }}
            />
            <div className="plan-card-content">
              <ResourcePlanImage plan={plan.type} resourceType={resourceType} />
              <ul className="plan-list">
                {Array.isArray(plan.list) &&
                  plan.list.map((item: string, index: number) => (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: item,
                      }}
                    />
                  ))}
              </ul>
            </div>
          </label>
        ))}
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="Back"
            click={() => updateState('orderStepActive', OrderSection.RECOMMENDED_PLAN)}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Proceed"
            className="full"
            buttonStyle="red"
            disabledLoader
            click={goToSelectPlan}
          />
        </div>
      </div>
    </div>
  );
};
