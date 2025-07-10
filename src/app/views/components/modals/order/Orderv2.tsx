import { useEffect, useState } from 'react';

import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import { ScopeOrderModal } from './layouts/scopes/OldScopeOrderModal';
import { FrequencyOrderModal } from './layouts/FrequencyOrderModal';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { OffensiveOrderModal } from './layouts/OffensiveOrderModal';
import { AdditionalOrderModal } from './layouts/AdditionalOrderModal';
import { PaymentMethodOrderModal } from './layouts/PaymentMethodOrderModal';
import { OrderProgressBar } from '@/app/views/components/progressive-steps/OrderProgressBar';
import { WelcomeOrderModal } from './layouts/WelcomeOrderModal';
import { OrderSection } from '@interfaces/order';
import { useOrders, userOrderFinished } from '@hooks/orders/useOrders';
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
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

// ESTE MAPA ES PARA CAMBIAR EL ANCHO DE LOS MODALES DE PRECIO
// Por defecto antes todos tenias 700 fijos
export const orderSectionMap: Record<OrderSection, number> = {
  [OrderSection.PAYWALL]: 800,
  [OrderSection.PAYWALL_MAX_SCAN]: 800,
  [OrderSection.SCOPE]: 700,
  [OrderSection.WEB_SCOPE]: 700,
  [OrderSection.MOBILE_SCOPE]: 700,
  [OrderSection.NETWORK_SCOPE]: 700,
  [OrderSection.SOCIAL_SCOPE]: 700,
  [OrderSection.ALL_PLANS]: 1160,
  [OrderSection.RECOMMENDED_PLAN]: 700,
  [OrderSection.SMALL_PLANS]: 1160,
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

export const orderSectionHeight: Record<OrderSection, number> = {
  [OrderSection.PAYWALL]: 700,
  [OrderSection.PAYWALL_MAX_SCAN]: 700,
  [OrderSection.SCOPE]: 580,
  [OrderSection.WEB_SCOPE]: 580,
  [OrderSection.MOBILE_SCOPE]: 580,
  [OrderSection.NETWORK_SCOPE]: 580,
  [OrderSection.SOCIAL_SCOPE]: 580,
  [OrderSection.ALL_PLANS]: 675,
  [OrderSection.RECOMMENDED_PLAN]: 580,
  [OrderSection.SMALL_PLANS]: 675,
  [OrderSection.ARABIC_PLAN]: 580,
  [OrderSection.FREQUENCY]: 580,
  [OrderSection.TEAM_SIZE]: 580,
  [OrderSection.ENVIRONMENT]: 580,
  [OrderSection.ADDITIONAL_INFO]: 580,
  [OrderSection.PAYMENT]: 580,
  [OrderSection.ANY_PAYMENT_METHOD]: 950,
  [OrderSection.PAYMENT_ERROR]: 580,
  [OrderSection.WELCOME]: 580,
  [OrderSection.WAIT_CHECK]: 580,
};

export const OrderV2 = () => {
  const [isNextStep, updateNextStep] = useState(false);
  const {
    orderStepActive,
    resetActiveOrder,
    open,
    setScopeAllTotalResources,
    referenceNumber,
    orderId,
    paywallSelected,
  } = useOrderStore(state => state);
  const isDefaultPlan = useGlobalFastField('isDefaultPlan');
  const [callback, setCallback] = useState<any>(null);
  const { refetchTotal } = useOrders();
  const finishOrder = userOrderFinished();

  useEffect(() => {
    if (open) {
      refetchTotal();
      updateNextStep(false);
    } else {
      setScopeAllTotalResources(-1);
    }
  }, [open]);
  const close = () => {
    if (orderStepActive === OrderSection.WELCOME) {
      finishOrder(referenceNumber, orderId, paywallSelected).then(() => {
        resetActiveOrder();
        isDefaultPlan.set(true);
      });
    } else {
      resetActiveOrder();
      isDefaultPlan.set(true);
      callback?.();
    }
  };
  const ActiveStep = () => {
    if (isNextStep) return <PageLoader />;
    if (orderStepActive === OrderSection.PAYWALL) return <PaywallOrderModal close={close} />;
    if (orderStepActive === OrderSection.PAYWALL_MAX_SCAN)
      return <PaywallOrderModal close={close} />;
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

    if (orderStepActive === OrderSection.ANY_PAYMENT_METHOD)
      return <AnyPaymentMethod setCallback={cb => setCallback(cb)} />;
    // if (orderStepActive === OrderSection.PAYMENT_ERROR) return <PaymentErrorOrderModal />;

    return orderStepActive === OrderSection.WELCOME ? (
      <WelcomeOrderModal close={close} />
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
        style={
          {
            '--order-modal-width': '1160px',
            '--order-modal-height': '100%',
          } as any
        }>
        {orderStepActive !== OrderSection.PAYWALL &&
        orderStepActive !== OrderSection.SMALL_PLANS &&
        orderStepActive !== OrderSection.ALL_PLANS &&
        orderStepActive !== OrderSection.PAYWALL_MAX_SCAN ? (
          <>
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
              </div>
            </header>
            <OrderProgressBar orderStepActive={orderStepActive} />
          </>
        ) : null}

        <div className="orders-content">
          <ActiveStep />
        </div>
      </div>
    </ModalWrapper>
  );
};
