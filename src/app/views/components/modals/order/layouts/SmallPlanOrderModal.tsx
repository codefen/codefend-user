import { PrimaryButton } from '@buttons/index';
import { OrderPaymentMethod, OrderSection, UserSmallPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState, useRef } from 'react';
import { PricingCard } from '../components/PricingCard';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { useRotatingText, ROTATING_SMALL_PLAN_TEXTS } from '@/app/data/hooks';
import { useMediaQuery } from 'usehooks-ts';

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
    planType: UserSmallPlanSelected.MEDIUM,
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
    planType: UserSmallPlanSelected.ADVANCED,
  },
];

export const SmallPlanOrderModal = () => {
  const [checkedOption, setCheckedOption] = useState(UserSmallPlanSelected.NOTHING);
  const { updateState, resetActiveOrder } = useOrderStore(state => state);
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany } = useUserData();
  const [prices, setPrices] = useState<any>(null);
  const { currentText, transitionStyle } = useRotatingText(ROTATING_SMALL_PLAN_TEXTS);
  
  // Swipe functionality
  const isMobile = useMediaQuery('(max-width: 768px)');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!!prices) return;
    fetcher<any>('post', {
      path: 'orders/add/small',
      body: {
        phase: 'plan',
        company_id: getCompany(),
      },
    }).then(({ data }) => {
      setPrices(data?.plans_prices);
    });
  }, []);

  // Swipe gesture handler
  useEffect(() => {
    if (!isMobile || !modalRef.current) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

      // Check if it's a horizontal swipe (left to right) and not vertical scroll
      if (deltaX > 100 && Math.abs(deltaY) < 100 && Math.abs(deltaX) > Math.abs(deltaY)) {
        close(); // Go back to previous step
      }

      touchStartRef.current = null;
    };

    const modalElement = modalRef.current;
    modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    modalElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart);
      modalElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, close]);

  const goTo = () => {
    if (checkedOption !== UserSmallPlanSelected.NOTHING) {
      fetcher<any>('post', {
        path: 'orders/add/small',
        body: {
          phase: 'plan',
          company_id: getCompany(),
          chosen_plan: checkedOption,
        },
      }).then(({ data }) => {
        updateState('orderId', data?.order?.id);
        updateState('referenceNumber', data?.order?.reference_number);
        updateState('acceptCondition', true);
        updateState('orderStepActive', OrderSection.ANY_PAYMENT_METHOD);
        updateState('paymentMethod', OrderPaymentMethod.CARD);
        updateState('userSmallPlanSelected', checkedOption);
      });
    }
  };

  const close = () => {
    updateState('orderStepActive', OrderSection.PAYWALL);
    resetActiveOrder();
  };

  return (
    <div ref={modalRef} className="step-content plan" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
        <p 
          style={transitionStyle}
          dangerouslySetInnerHTML={{ __html: currentText }}
        />
      </div>
      
      <div className="plans-vertical-container">
        {pricingPlans.map(plan => (
          <div 
            key={plan.planType}
            className={`flex-box-row clickable-plan ${checkedOption === plan.planType ? 'selected' : ''}`}
            onClick={() => setCheckedOption(plan.planType)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex-box-column">
              <img src="/codefend/IA ICON.png" alt={plan.title} style={{ width: '80px', height: 'auto' }} />
              <span className="codefend-text-red title-format price">${prices?.[plan.planType] || plan.price} per month</span>
            </div>
            <ul className="plan-list">
              {plan.features.map((feature: string, index: number) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: feature,
                  }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="button-wrapper next-btns">
        <PrimaryButton
          text="Close Asistant"
          className="flex-1"
          click={close}
          buttonStyle="gray"
          disabledLoader
          isDisabled={isLoading}
        />
        <PrimaryButton
          text="Proceed"
          className="flex-1"
          click={goTo}
          buttonStyle="red"
          disabledLoader
          isDisabled={checkedOption === UserSmallPlanSelected.NOTHING || isLoading}
        />
      </div>
    </div>
  );
};
