import React from 'react';
import { PrimaryButton, SecondaryButton } from '../..';
import { OrderSection, OrderTeamSize, useOrderStore } from '../../../../data';

export const TeamSizeOrderModal = () => {
	const { teamSize, updateState } = useOrderStore((state) => state);

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

			<div
				className={`scope-content show-both-borders ${teamSize === OrderTeamSize.SMALL && 'show-bottom-border'} ${teamSize === OrderTeamSize.FULL && 'show-top-border'}`}>
				<div
					className={`option show-border order-pointer ${
						teamSize === OrderTeamSize.SMALL && `select-option`
					}`}
					onClick={() => updateState('teamSize', OrderTeamSize.SMALL)}>
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
					className={`option order-pointer ${teamSize === OrderTeamSize.SMALL && 'show-bottom-border'} ${teamSize === OrderTeamSize.FULL && 'show-top-border'} ${
						teamSize === OrderTeamSize.MID && `select-option`
					}`}
					onClick={() => updateState('teamSize', OrderTeamSize.MID)}>
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
					className={`option  bottom-border order-pointer ${
						teamSize === OrderTeamSize.FULL && `select-option`
					}`}
					onClick={() => updateState('teamSize', OrderTeamSize.FULL)}>
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
						click={() =>
							updateState('orderStepActive', OrderSection.ORDER_REVIEW)
						}
						className="full"
					/>
				</div>
			</div>
		</>
	);
};
