import { OrderSection, useOrderStore } from '../../../../data';
import { ModalWrapper } from '..';
import { ScopeOrderModal } from './ScopeOrderModal';
import { FrequencyOrderModal } from './FrequencyOrderModal';
import { TeamSizeOrderModal } from './TeamSizeOrderModal';
import { OrderReviewModal } from './OrderReviewModal';
import './order.scss';

export const OrderV2 = () => {
	const { orderStepActive, resetActiveOrder, open } = useOrderStore(
		(state) => state,
	);

	const currentOrCompleted = (current: OrderSection, verify: OrderSection) => {
		if (verify === current) return ' current';
		return verify < current ? ' completed' : '';
	};

	const ActiveStep = () => {
		if (orderStepActive === OrderSection.SCOPE) return <ScopeOrderModal />;
		if (orderStepActive === OrderSection.FREQUENCY)
			return <FrequencyOrderModal />;
		if (orderStepActive === OrderSection.TEAM_SIZE)
			return <TeamSizeOrderModal />;
		if (orderStepActive === OrderSection.ORDER_REVIEW)
			return <OrderReviewModal />;
		if (orderStepActive === OrderSection.SELECT_LEAD) return <>Hola</>;
		if (orderStepActive === OrderSection.ENVIRONMENT) return <>Hola</>;
		if (orderStepActive === OrderSection.ADDITIONAL_INFO) return <>Hola</>;
		if (orderStepActive === OrderSection.PAYMENT_METHOD) return <>Hola</>;

		return <>Hola</>;
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
							<span
								className={`step ${currentOrCompleted(orderStepActive, OrderSection.SCOPE)}`}>
								<div className="step-dot"></div>
								<p>Scope</p>
							</span>
							<span
								className={`step ${currentOrCompleted(orderStepActive, OrderSection.FREQUENCY)}`}>
								<div className="step-dot"></div>
								<p>Frequency</p>
							</span>
							<span
								className={`step ${currentOrCompleted(orderStepActive, OrderSection.TEAM_SIZE)} ${orderStepActive + 1 === OrderSection.TEAM_SIZE ? 'next-step' : ''}`}>
								<div className="step-dot"></div>
								<p>Team size</p>
							</span>
							<span
								className={`step ${currentOrCompleted(orderStepActive, OrderSection.ORDER_REVIEW)} ${orderStepActive + 1 === OrderSection.ORDER_REVIEW ? 'next-step' : ''}`}>
								<div className="step-dot"></div>
								<p>Order review</p>
							</span>
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
