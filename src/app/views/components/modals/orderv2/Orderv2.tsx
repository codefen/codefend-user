import { OrderSection, useOrderStore } from '../../../../data';
import { ModalWrapper } from '..';

export const OrderV2 = ({ closeModal }: { closeModal: () => void }) => {
	const { orderStepActive, resetActiveOrder } = useOrderStore(
		(state) => state,
	);

	const ActiveStep = () => {
		if (orderStepActive === OrderSection.SCOPE) return <>Hola</>;
		if (orderStepActive === OrderSection.FREQUENCY) return <>Hola</>;
		if (orderStepActive === OrderSection.TEAM_SIZE) return <>Hola</>;
		if (orderStepActive === OrderSection.ORDER_REVIEW) return <>Hola</>;
		if (orderStepActive === OrderSection.SELECT_LEAD) return <>Hola</>;
		if (orderStepActive === OrderSection.ENVIRONMENT) return <>Hola</>;
		if (orderStepActive === OrderSection.ADDITIONAL_INFO) return <>Hola</>;
		if (orderStepActive === OrderSection.PAYMENT_METHOD) return <>Hola</>;

		return <>Hola</>;
	};

	const close = () => {
		closeModal();
		resetActiveOrder();
	};

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

					<div className="steps"></div>
				</header>

				<div className="orders-content">
					<ActiveStep />
				</div>
			</div>
		</ModalWrapper>
	);
};
