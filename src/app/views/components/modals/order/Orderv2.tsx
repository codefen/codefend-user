import {
	OrderPaymentMethod,
	OrderSection,
	useOrderStore,
} from '../../../../data';
import { ModalWrapper } from '..';
import { ScopeOrderModal } from './layouts/ScopeOrderModal';
import { FrequencyOrderModal } from './layouts/FrequencyOrderModal';
import { TeamSizeOrderModal } from './layouts/TeamSizeOrderModal';
import { OrderReviewModal } from './layouts/OrderReviewModal';
import './order.scss';
import { useState } from 'react';
import { PageLoader } from '../..';
import { LeadOrderModal } from './layouts/LeadOrderModal';
import { EnvironmentOrderModal } from './layouts/EnvironmentOrderModal';
import { AdditionalOrderModal } from './layouts/AdditionalOrderModal';
import { PaymentMethodOrderModal } from './layouts/PaymentMethodOrderModal';
import { ActiveProgressLine } from './components/ActiveProgessiveSteps';
import { WelcomeOrderModal } from './layouts/WelcomeOrderModal';

export const OrderV2 = () => {
	const [isNextStep, updateNextStep] = useState(false);
	const { orderStepActive, resetActiveOrder, open, paymentMethod } =
		useOrderStore((state) => state);

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
			return <EnvironmentOrderModal />;
		if (orderStepActive === OrderSection.ADDITIONAL_INFO)
			return <AdditionalOrderModal />;
		if (
			orderStepActive === OrderSection.PAYMENT ||
			paymentMethod !== OrderPaymentMethod.FINISHED
		)
			return <PaymentMethodOrderModal />;

		return orderStepActive === OrderSection.WELCOME ? (
			<WelcomeOrderModal />
		) : (
			<>adio</>
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
							<h2>Execute a new pentest</h2>
						</div>

						<div className="steps">
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