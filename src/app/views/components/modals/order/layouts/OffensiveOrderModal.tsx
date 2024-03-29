import { type FC, useState } from 'react';
import { PrimaryButton } from '../../..';
import {
	useOrderStore,
	OrderSection,
	OrderOffensive,
	useOrderOffensive,
} from '../../../../../data';

export const OffensiveOrderModal: FC = () => {
	const { offensiveOrder, updateState, referenceNumber } = useOrderStore(
		(state) => state,
	);

	const [offensiveOrderW, setOffensiveOrder] =
		useState<OrderOffensive>(offensiveOrder);
	const { sendOrderProvider } = useOrderOffensive();

	const nextStep = () => {
		updateState('offensiveOrder', offensiveOrderW);
		sendOrderProvider(referenceNumber, offensiveOrderW);
		updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>
						Please tell us about the environment. Are this systems in
						active use?
					</b>
				</h3>
			</div>
			<div className="scope-content show-both-borders">
				<div
					className={`option order-pointer show-both-borders ${
						offensiveOrderW === OrderOffensive.CAREFUL
							? `select-option`
							: ``
					}`}
					onClick={() => setOffensiveOrder(OrderOffensive.CAREFUL)}>
					<img
						src="/codefend/order-frequency1.svg"
						alt="fast-pentest-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="codefend-text-red space">
									Careful pentest:
								</span>
								recommended for production environments.
							</p>
						</div>
						<span className="one-pentest">
							All or some of the resources are in a production
							environment Codefend's professionals will be extra careeful
							and will avoid risk.
						</span>
					</div>
				</div>
				<div
					className={`option order-pointer show-both-borders ${
						offensiveOrderW === OrderOffensive.OFFENSIVE
							? `select-option`
							: ``
					}`}
					onClick={() => setOffensiveOrder(OrderOffensive.OFFENSIVE)}>
					<img
						src="/codefend/order-frequency1.svg"
						alt="fast-pentest-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="codefend-text-red space">
									Offensive pentest:
								</span>
								recommended for test environment
							</p>
						</div>
						<span className="one-pentest">
							All the resources or infrastructure is an a test
							environment Codefend's professionals may use more
							disruptive or risky techniques.
						</span>
					</div>
				</div>
				<div
					className={`option order-pointer show-both-borders ${
						offensiveOrderW === OrderOffensive.ADVERSARY &&
						`select-option`
					}`}
					onClick={() => setOffensiveOrder(OrderOffensive.ADVERSARY)}>
					<img
						src="/codefend/order-frequency1.svg"
						alt="fast-pentest-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="codefend-text-red space">
									Adversary simulation pentest:
								</span>
								not recommended / may cause stress
							</p>
						</div>
						<span className="one-pentest">
							Codefend's professionals will use all possible tecniques in
							order to simulate a real attack & cause disorder. Global
							scope, only premium.
						</span>
					</div>
				</div>
			</div>
			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<PrimaryButton
						text="back"
						click={() =>
							updateState('orderStepActive', OrderSection.SELECT_LEAD)
						}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue"
						click={nextStep}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
