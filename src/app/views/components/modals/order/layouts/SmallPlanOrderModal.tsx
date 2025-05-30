import { PrimaryButton } from '@buttons/index';
import { OrderPaymentMethod, OrderSection, UserSmallPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useState } from 'react';
import { PricingCard } from '../components/PricingCard';

const pricingPlans = [
  {
    title: 'Basic Machine',
    price: 29,
    features: [
      'Issue visualization: Unlimited',
      'Report generation: Unlimited',
      'Ask a hacker: <b>5 per month</b>',
      'Neuroscans: <b>5 per month</b>',
      'Data leaks lookups: <b>5 per month</b>',
    ],
    planType: UserSmallPlanSelected.BASIC,
  },
  {
    title: 'Medium Machine',
    price: 59,
    features: [
      'Issue visualization: Unlimited',
      'Report generation: Unlimited',
      'Ask a hacker: <b>10 per month</b>',
      'Neuroscans: <b>10 per month</b>',
      'Data leaks lookups: <b>10 per month</b>',
    ],
    planType: UserSmallPlanSelected.ADVANCED,
  },
  {
    title: 'Advanced Machine',
    price: 89,
    features: [
      'Issue visualization: Unlimited',
      'Report generation: Unlimited',
      'Ask a hacker: <b>20 per month</b>',
      'Neuroscans: <b>20 per month</b>',
      'Data leaks lookups: <b>20 per month</b>',
    ],
    planType: UserSmallPlanSelected.MEDIUM,
  },
];

export const SmallPlanOrderModal = () => {
  const [checkedOption, setCheckedOption] = useState(UserSmallPlanSelected.NOTHING);
  const { updateState } = useOrderStore(state => state);

  const goTo = () => {
    if (checkedOption !== UserSmallPlanSelected.NOTHING) {
      updateState('orderStepActive', OrderSection.ANY_PAYMENT_METHOD);
      updateState('paymentMethod', OrderPaymentMethod.CARD);
      updateState('userSmallPlanSelected', checkedOption);
    }
  };

  const close = () => {
    updateState('orderStepActive', OrderSection.PAYWALL);
    updateState('open', false);
  };

  return (
    <div className="step-content plan">
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
            style={{ width: '50px', height: 'auto', margin: '0.5rem', display: 'block' }}
          />
          <h3 style={{ margin: 0 }}>Automated Plan for Small Businesses</h3>
        </div>
        <p>
          Exclusive small plans for web applications offer a unique combination of{' '}
          <strong>automated scanners</strong>, specialized technical support, and{' '}
          <strong>data leak detection</strong>. All provide unlimited access to the platform with
          report creation and issue visualization.
        </p>
      </div>
      <div className="step-content-gird">
        {pricingPlans.map(plan => (
          <PricingCard
            key={plan.planType}
            title={plan.title}
            price={plan.price}
            features={plan.features}
            imageSrc="public/codefend/IA ICON.png"
            selectedPlan={checkedOption}
            planType={plan.planType}
            onSelect={selectedPlan => setCheckedOption(selectedPlan)}
          />
        ))}
      </div>
      <div className="button-wrapper next-btns">
        <PrimaryButton
          text="Close Asistant"
          className="flex-1"
          click={close}
          buttonStyle="gray"
          disabledLoader
        />
        <PrimaryButton
          text="Proceed"
          className="flex-1"
          click={goTo}
          buttonStyle="red"
          disabledLoader
          isDisabled={checkedOption === UserSmallPlanSelected.NOTHING}
        />
      </div>
    </div>
  );
};
