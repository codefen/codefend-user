import { type FC, useState } from 'react';
import { PrimaryButton } from '../../..';
import {
	OrderFrequency,
	OrderSection,
	useOrderMembership,
	useOrderStore,
} from '../../../../../data';

export const FrequencyOrderModal: FC = () => {
	const { frequency, updateState, referenceNumber, orderId } = useOrderStore(
		(state) => state,
	);

	const [frequencyW, setFrequency] = useState<OrderFrequency>(frequency);
	const { sendMemberShip } = useOrderMembership();

	const nextStep = () => {
		if (referenceNumber && frequencyW !== OrderFrequency.UNKNOWN) {
			updateState('frequency', frequencyW);
			sendMemberShip(frequencyW, referenceNumber, orderId);
			updateState('orderStepActive', OrderSection.TEAM_SIZE);
		}
	};

	return (
		<>
			<div className="step-header">
				<h3>
					<b>We will size the task, please select the model.</b>
					<span>
						Below you can see various options that will help us
						personalize your experience:
					</span>
				</h3>
			</div>
			<div className="step-content">
				<div
					className={`option order-pointer ${
						frequencyW === OrderFrequency.ONCE && `select-option`
					}`}
					onClick={() => setFrequency(OrderFrequency.ONCE)}>
					<img
						src="/codefend/order-frequency1.svg"
						alt="fast-pentest-icon"
						className="step-image"
						decoding="async"
						loading="lazy"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="alt-color space">
									One “snapshot” pentest:
								</span>
								recommended for initial review of resources before of
								being employees, billed eleven.
							</p>
						</div>
						<span className="one-pentest">
							A single pentest + report will be carried out
						</span>
					</div>
				</div>
				<div
					className={`option order-pointer ${
						frequencyW === OrderFrequency.MEMBER_SHIP && `select-option`
					}`}
					onClick={() => setFrequency(OrderFrequency.MEMBER_SHIP)}>
					<img
						src="/codefend/order-frequency2.svg"
						alt="large-pentest-icon"
						className="step-image"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="alt-color space">
									Permanent surveillance:
								</span>
								recommended for permanent monitoring resources, billed
								monthly.
							</p>
						</div>
						<span className="one-pentest">
							A maximum of 12 pentests will be carried out annually.
						</span>
					</div>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<PrimaryButton
						text="Back"
						click={(e: any) =>
							updateState('orderStepActive', OrderSection.SCOPE)
						}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						isDisabled={frequencyW === OrderFrequency.UNKNOWN}
						disabledLoader
						text="Proceed to the next step"
						click={nextStep}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
