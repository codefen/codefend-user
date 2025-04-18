import { useEffect, useState } from 'react';

import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import { ScopeOrderModal } from './layouts/ScopeOrderModal';
import { FrequencyOrderModal } from './layouts/FrequencyOrderModal';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { OffensiveOrderModal } from './layouts/OffensiveOrderModal';
import { AdditionalOrderModal } from './layouts/AdditionalOrderModal';
import { PaymentMethodOrderModal } from './layouts/PaymentMethodOrderModal';
import { ActiveProgressiveSteps } from '@/app/views/components/progressive-steps/ActiveProgressiveSteps';
import { WelcomeOrderModal } from './layouts/WelcomeOrderModal';
import { OrderSection } from '@interfaces/order';
import { useOrders } from '@hooks/useOrders';
import { useOrderStore } from '@stores/orders.store';
import './order.scss';
import { WaitingCheckOrderModal } from './layouts/WaitingCheckOrderModal';
import { TeamSizeOrderModal } from '@modals/order/layouts/TeamSizeOrderModal';
import { AnyPaymentMethod } from '@modals/order/layouts/AnyPaymentMetod';
import { PaywallOrderModal } from '@modals/order/layouts/PaywallOrderModal';
import { SmallPlanOrderModal } from '@modals/order/layouts/SmallPlanOrderModal';
import { ArabicOrderModal } from '@modals/order/layouts/ArabicOrderModal';

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
    SmallPlanOrderModal;
    if (orderStepActive === OrderSection.SCOPE) return <ScopeOrderModal />;
    if (orderStepActive === OrderSection.FREQUENCY) return <FrequencyOrderModal />;
    if (orderStepActive === OrderSection.TEAM_SIZE) return <TeamSizeOrderModal />;
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
      <div className="order-container">
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
            {orderStepActive !== OrderSection.PAYWALL ? (
              <ActiveProgressiveSteps orderStepActive={orderStepActive} />
            ) : null}
          </div>
        </header>

        <div className="orders-content">
          <ActiveStep />
        </div>
      </div>
    </ModalWrapper>
  );
};
