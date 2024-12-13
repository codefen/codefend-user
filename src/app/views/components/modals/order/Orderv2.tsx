import { useEffect, useState } from 'react';

import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import { ScopeOrderModal } from './layouts/ScopeOrderModal';
import { FrequencyOrderModal } from './layouts/FrequencyOrderModal';
import { PageLoader } from '@defaults/loaders/Loader';
import { OffensiveOrderModal } from './layouts/OffensiveOrderModal';
import { AdditionalOrderModal } from './layouts/AdditionalOrderModal';
import { PaymentMethodOrderModal } from './layouts/PaymentMethodOrderModal';
import { ActiveProgressiveSteps } from '@standalones/progressive-steps/ActiveProgressiveSteps';
import { WelcomeOrderModal } from './layouts/WelcomeOrderModal';
import { OrderSection } from '@interfaces/order';
import { useOrders } from '@hooks/useOrders';
import { useOrderStore } from '@stores/orders.store';
import './order.scss';
import { WaitingCheckOrderModal } from './layouts/WaitingCheckOrderModal';

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

  const ActiveStep = () => {
    if (isNextStep) return <PageLoader />;
    if (orderStepActive === OrderSection.SCOPE) return <ScopeOrderModal />;
    if (orderStepActive === OrderSection.FREQUENCY) return <FrequencyOrderModal />;
    // if (orderStepActive === OrderSection.TEAM_SIZE) return <TeamSizeOrderModal />;
    //if (orderStepActive === OrderSection.ORDER_REVIEW)
    //	return <OrderReviewModal updateNextStep={updateNextStep} />;
    //if (orderStepActive === OrderSection.SELECT_LEAD)
    //	return <LeadOrderModal />;
    if (orderStepActive === OrderSection.ENVIRONMENT) return <OffensiveOrderModal />;
    if (orderStepActive === OrderSection.ADDITIONAL_INFO) return <AdditionalOrderModal />;
    if (orderStepActive === OrderSection.PAYMENT) return <PaymentMethodOrderModal />;

    // if (orderStepActive === OrderSection.ANY_PAYMENT_METHOD) return <AnyPaymentMetod />;
    // if (orderStepActive === OrderSection.PAYMENT_ERROR) return <PaymentErrorOrderModal />;

    return orderStepActive === OrderSection.WELCOME ? (
      <WelcomeOrderModal />
    ) : (
      <WaitingCheckOrderModal />
    );
  };

  const close = () => {
    resetActiveOrder();
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
            <ActiveProgressiveSteps orderStepActive={orderStepActive} />
          </div>
        </header>

        <div className="orders-content">
          <ActiveStep />
        </div>
      </div>
    </ModalWrapper>
  );
};
