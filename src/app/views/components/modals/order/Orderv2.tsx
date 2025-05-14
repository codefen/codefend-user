import { useEffect, useState } from 'react';

import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import { ScopeOrderModal } from './layouts/scopes/OldScopeOrderModal';
import { FrequencyOrderModal } from './layouts/FrequencyOrderModal';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { OffensiveOrderModal } from './layouts/OffensiveOrderModal';
import { AdditionalOrderModal } from './layouts/AdditionalOrderModal';
import { PaymentMethodOrderModal } from './layouts/PaymentMethodOrderModal';
import { ActiveProgressiveSteps } from '@/app/views/components/progressive-steps/ActiveProgressiveSteps';
import { WelcomeOrderModal } from './layouts/WelcomeOrderModal';
import { OrderSection } from '@interfaces/order';
import { useOrders } from '@hooks/orders/useOrders';
import { useOrderStore } from '@stores/orders.store';
import './order.scss';
import { WaitingCheckOrderModal } from './layouts/WaitingCheckOrderModal';
import { TeamSizeOrderModal } from '@modals/order/layouts/TeamSizeOrderModal';
import { AnyPaymentMethod } from '@modals/order/layouts/AnyPaymentMetod';
import { PaywallOrderModal } from '@modals/order/layouts/PaywallOrderModal';
import { SmallPlanOrderModal } from '@modals/order/layouts/SmallPlanOrderModal';
import { ArabicOrderModal } from '@modals/order/layouts/ArabicOrderModal';
import { WebScopeModal } from '@modals/order/layouts/scopes/WebScopeModal';
import { RecommendedPlanOrderModal } from '@modals/order/layouts/RecommendedPlanOrderModal';
import { AllPlansOrderModal } from '@modals/order/layouts/AllPlansOrderModal';
import { MobileScopeModal } from '@modals/order/layouts/scopes/MobileScopeModal';
import { NetworkScopeModal } from '@modals/order/layouts/scopes/NetworkScopeModal';
import { SocialScopeModal } from '@modals/order/layouts/scopes/SocialScopeModal';

export const orderSectionMap: Record<OrderSection, number> = {
  [OrderSection.PAYWALL]: 700,
  [OrderSection.SCOPE]: 700,
  [OrderSection.WEB_SCOPE]: 700,
  [OrderSection.MOBILE_SCOPE]: 700,
  [OrderSection.NETWORK_SCOPE]: 700,
  [OrderSection.SOCIAL_SCOPE]: 700,
  [OrderSection.ALL_PLANS]: 1030,
  [OrderSection.RECOMMENDED_PLAN]: 700,
  [OrderSection.SMALL_PLANS]: 900,
  [OrderSection.ARABIC_PLAN]: 700,
  [OrderSection.FREQUENCY]: 700,
  [OrderSection.TEAM_SIZE]: 700,
  [OrderSection.ENVIRONMENT]: 700,
  [OrderSection.ADDITIONAL_INFO]: 700,
  [OrderSection.PAYMENT]: 700,
  [OrderSection.ANY_PAYMENT_METHOD]: 700,
  [OrderSection.PAYMENT_ERROR]: 700,
  [OrderSection.WELCOME]: 700,
  [OrderSection.WAIT_CHECK]: 700,
};

export const OrderV2 = () => {
  const [isNextStep, updateNextStep] = useState(false);
  const { orderStepActive, resetActiveOrder, open, setScopeAllTotalResources } = useOrderStore(
    state => state
  );

  const { refetchTotal } = useOrders();

  useEffect(() => {
    if (open) {
      refetchTotal();
      updateNextStep(false);
    } else {
      setScopeAllTotalResources(-1);
    }
  }, [open]);
  const close = () => {
    resetActiveOrder();
  };
  const ActiveStep = () => {
    if (isNextStep) return <PageLoader />;
    if (orderStepActive === OrderSection.PAYWALL) return <PaywallOrderModal close={close} />;
    if (orderStepActive === OrderSection.SMALL_PLANS) return <SmallPlanOrderModal />;
    if (orderStepActive === OrderSection.ARABIC_PLAN) return <ArabicOrderModal />;

    if (orderStepActive === OrderSection.SCOPE) return <WebScopeModal />;
    if (orderStepActive === OrderSection.WEB_SCOPE) return <WebScopeModal />;
    if (orderStepActive === OrderSection.MOBILE_SCOPE) return <MobileScopeModal />;
    if (orderStepActive === OrderSection.NETWORK_SCOPE) return <NetworkScopeModal />;
    if (orderStepActive === OrderSection.SOCIAL_SCOPE) return <SocialScopeModal />;

    if (orderStepActive === OrderSection.FREQUENCY) return <FrequencyOrderModal />;
    if (orderStepActive === OrderSection.TEAM_SIZE) return <TeamSizeOrderModal />;
    if (orderStepActive === OrderSection.ALL_PLANS) return <AllPlansOrderModal />;
    if (orderStepActive === OrderSection.RECOMMENDED_PLAN) return <RecommendedPlanOrderModal />;
    //if (orderStepActive === OrderSection.ORDER_REVIEW)
    //	return <OrderReviewModal updateNextStep={updateNextStep} />;
    //if (orderStepActive === OrderSection.SELECT_LEAD)
    //	return <LeadOrderModal />;
    if (orderStepActive === OrderSection.ENVIRONMENT) return <OffensiveOrderModal />;
    if (orderStepActive === OrderSection.ADDITIONAL_INFO) return <AdditionalOrderModal />;
    if (orderStepActive === OrderSection.PAYMENT) return <PaymentMethodOrderModal />;

    if (orderStepActive === OrderSection.ANY_PAYMENT_METHOD) return <AnyPaymentMethod />;
    // if (orderStepActive === OrderSection.PAYMENT_ERROR) return <PaymentErrorOrderModal />;

    return orderStepActive === OrderSection.WELCOME ? (
      <WelcomeOrderModal />
    ) : (
      <WaitingCheckOrderModal />
    );
  };

  if (!open) {
    return null;
  }

  return (
    <ModalWrapper action={close}>
      <div
        className="order-container"
        style={{ '--order-modal-width': `${orderSectionMap[orderStepActive]}px` } as any}>
        {orderStepActive !== OrderSection.PAYWALL ? (
          <header className="order-header">
            <div className="order-header-title">
              <img
                src="/codefend/pentest-header-vector.svg"
                alt="codefend-icon"
                aria-label="codefend-icon"
              />
              <h2>
                <span>Execute a </span>new pentest
              </h2>
              <ActiveProgressiveSteps orderStepActive={orderStepActive} />
            </div>
          </header>
        ) : null}

        <div className="orders-content">
          <ActiveStep />
        </div>
      </div>
    </ModalWrapper>
  );
};
