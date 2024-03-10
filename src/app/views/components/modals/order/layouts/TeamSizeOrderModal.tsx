import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../../..';
import {
	OrderSection,
	OrderTeamSize,
	useOrderStore,
} from '../../../../../data';

export const TeamSizeOrderModal = () => {
	const { teamSize, updateState } = useOrderStore((state) => state);

	const [teamSizeW, setTeamSize] = useState<OrderTeamSize>(teamSize);

	const nextStep = () => {
		updateState('teamSize', teamSizeW);
		updateState('orderStepActive', OrderSection.ORDER_REVIEW);
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>We will size the task, please select the model.</b>
					<span>
						Below you can see various options that will help us
						personalize your experience:
					</span>
				</h3>
			</div>

			<div className="scope-content show-both-borders">
				<div
					className={`option show-both-borders order-pointer ${
						teamSizeW === OrderTeamSize.SMALL && `select-option`
					}`}
					onClick={() => setTeamSize(OrderTeamSize.SMALL)}>
					<h4 className="codefend-text-red">$1,500</h4>

					<div className="order-snapshot">
						<div className="top">
							<h5>Small allocation:</h5>
						</div>
						<span className="one-pentest">
							a multidisciplinary team of professional hackers
							exclusively reviewing your case.
						</span>
					</div>
				</div>
				<div
					className={`option order-pointer show-both-borders ${
						teamSizeW === OrderTeamSize.MID && `select-option`
					}`}
					onClick={() => setTeamSize(OrderTeamSize.MID)}>
					<h4 className="codefend-text-red">$4,500</h4>

					<div className="order-snapshot">
						<div className="top">
							<h5>Medium allocation:</h5>
						</div>
						<span className="one-pentest">
							a multidisciplinary team of professional hackers
							exclusively reviewing your case.
						</span>
					</div>
				</div>
				<div
					className={`option show-both-borders order-pointer ${
						teamSizeW === OrderTeamSize.FULL && `select-option`
					}`}
					onClick={() => setTeamSize(OrderTeamSize.FULL)}>
					<h4 className="codefend-text-red">$13,500</h4>

					<div className="order-snapshot">
						<div className="top">
							<h5>Full team allocation:</h5>
						</div>
						<span className="one-pentest">
							a multidisciplinary team of professional hackers
							exclusively reviewing your case.
						</span>
					</div>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<SecondaryButton
						text="back"
						click={(e: any) =>
							updateState('orderStepActive', OrderSection.FREQUENCY)
						}
						className="full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue"
						click={nextStep}
						className="full"
					/>
				</div>
			</div>
		</>
	);
};
