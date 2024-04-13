import { useEffect, useState } from 'react';

import { ModalWrapper } from '..';
import { ScopeOrderModal } from './layouts/ScopeOrderModal';
import { FrequencyOrderModal } from './layouts/FrequencyOrderModal';
import { TeamSizeOrderModal } from './layouts/TeamSizeOrderModal';
import { OrderReviewModal } from './layouts/OrderReviewModal';
import { PageLoader } from '../..';
import { LeadOrderModal } from './layouts/LeadOrderModal';
import { OffensiveOrderModal } from './layouts/OffensiveOrderModal';
import { AdditionalOrderModal } from './layouts/AdditionalOrderModal';
import { PaymentMethodOrderModal } from './layouts/PaymentMethodOrderModal';
import { ActiveProgressLine } from './components/ActiveProgessiveSteps';
import { WelcomeOrderModal } from './layouts/WelcomeOrderModal';
import { OrderSection, useOrderStore, useOrders } from '../../../../data';
import { AnyPaymentMetod } from './layouts/AnyPaymentMetod';
import './order.scss';
import { WaitingCheckOrderModal } from './layouts/WaitingCheckOrderModal';
import { PaymentErrorOrderModal } from './layouts/PaymentErrorOrderModal';

export const OrderV2 = () => {
	const [isNextStep, updateNextStep] = useState(false);
	const { orderStepActive, resetActiveOrder, open, scope } = useOrderStore(
		(state) => state,
	);

	const { refetchTotal } = useOrders();

	useEffect(() => {
		refetchTotal();
		updateNextStep(false);
	}, [scope.totalResources]);

	const ActiveStep = () => {
		if (isNextStep) return <PageLoader />;
		if (orderStepActive === OrderSection.SCOPE) return <ScopeOrderModal />;
		if (orderStepActive === OrderSection.FREQUENCY)
			return <FrequencyOrderModal />;
		if (orderStepActive === OrderSection.TEAM_SIZE)
			return <TeamSizeOrderModal />;
		if (orderStepActive === OrderSection.ORDER_REVIEW)
			return <OrderReviewModal updateNextStep={updateNextStep} />;
		if (orderStepActive === OrderSection.SELECT_LEAD)
			return <LeadOrderModal />;
		if (orderStepActive === OrderSection.ENVIRONMENT)
			return <OffensiveOrderModal />;
		if (orderStepActive === OrderSection.ADDITIONAL_INFO)
			return <AdditionalOrderModal />;
		if (orderStepActive === OrderSection.PAYMENT)
			return <PaymentMethodOrderModal />;

		if (orderStepActive === OrderSection.ANY_PAYMENT_METHOD)
			return <AnyPaymentMetod />;
		if (orderStepActive === OrderSection.PAYMENT_ERROR)
			return <PaymentErrorOrderModal />;

		return orderStepActive === OrderSection.WELCOME ? (
			<WelcomeOrderModal />
		) : (
			<WaitingCheckOrderModal />
		);
	};

	const close = () => {
		resetActiveOrder();
	};

	if (open) {
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
							<ActiveProgressLine
								isNextStep={isNextStep}
								orderStepActive={orderStepActive}
							/>
						</div>
					</header>

					<div className="orders-content">
						<ActiveStep />
					</div>
				</div>
			</ModalWrapper>
		);
	} else {
		return <></>;
	}
};
