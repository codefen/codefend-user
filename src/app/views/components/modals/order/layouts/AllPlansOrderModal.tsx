import { AppConstants } from '@/app/constants/app-contanst';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection } from '@interfaces/order';
import { PricingCard } from '@modals/order/components/PricingCard';
import { ResourcePlanImage } from '@modals/order/components/ResourcePlanImage';
import { useOrderStore } from '@stores/orders.store';
import { useRotatingText } from '@/app/data/hooks';
import { useEffect, useState } from 'react';

const VISIBLE_PLANS = ['small', 'medium', 'advanced'];

export const AllPlansOrderModal = () => {
  const store = useGlobalFastFields(['planPreference', 'isDefaultPlan']);
  const { updateState, resourceType } = useOrderStore(state => state);
  const { currentText, transitionStyle } = useRotatingText();
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
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      <button 
        className="close-button"
        onClick={closeModal}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          <img
            src="/codefend/estrellitas.png"
            alt="estrellas"
            style={{ height: '35px', width: 'auto', display: 'block' }}
          />
          <h3 style={{ margin: 0 }}>Professional hackers & Pentest on demand</h3>
        </div>
        <p
          style={transitionStyle}
          dangerouslySetInnerHTML={{
            __html: currentText,
          }}
        />
      </div>
      
      <div className="plans-vertical-container">
        {plans.map(([_, plan]: any) => (
          <div 
            key={plan.type}
            className={`flex-box-row clickable-plan ${store.planPreference.get === plan.type ? 'selected' : ''}`}
            onClick={() => changed(plan.type)}
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
