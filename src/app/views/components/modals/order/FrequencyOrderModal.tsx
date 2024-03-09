import React from 'react';
import { PrimaryButton, SecondaryButton } from '../..';
import { OrderFrequency, OrderSection, useOrderStore } from '../../../../data';

export const FrequencyOrderModal = () => {
	const { frequency, updateState } = useOrderStore((state) => state);

	return (
		<div>
			<div className="option-header">
				<h3>
					<b>We will size the task, please select the model.</b>
					<span>
						Below you can see various options that will help us
						personalize your experience:
					</span>
				</h3>
			</div>
			<div
				className={`scope-content ${frequency === OrderFrequency.ONE_ORDER ? 'show-bottom-border' : 'show-top-border'}`}>
				<div
					className={`option order-pointer ${
						frequency === OrderFrequency.ONE_ORDER && `select-option`
					}`}
					onClick={() =>
						updateState('frequency', OrderFrequency.ONE_ORDER)
					}>
					<img
						src="/codefend/order-frequency1.svg"
						alt="fast-pentest-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="codefend-text-red space">
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
						frequency === OrderFrequency.SUBSCRIPTION && `select-option`
					}`}
					onClick={() =>
						updateState('frequency', OrderFrequency.SUBSCRIPTION)
					}>
					<img
						src="/codefend/order-frequency2.svg"
						alt="large-pentest-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<p className="pentest-option">
								<span className="codefend-text-red space">
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
					<SecondaryButton
						text="back"
						click={(e: any) =>
							updateState('orderStepActive', OrderSection.SCOPE)
						}
						className="full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue"
						click={() =>
							updateState('orderStepActive', OrderSection.TEAM_SIZE)
						}
						className="full"
					/>
				</div>
			</div>
		</div>
	);
};
