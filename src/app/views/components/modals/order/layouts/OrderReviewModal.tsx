import React, { useState } from 'react';
import { PrimaryButton } from '../../..';
import { OrderSection, useOrderConfirm } from '../../../../../data';
import { toast } from 'react-toastify';
import useTimeout from '#commonHooks/useTimeout';

export const OrderReviewModal: React.FC<{
	updateNextStep: (updated: boolean) => void;
}> = (props) => {
	const {
		sendConfirmOrder,
		teamSizeText,
		frequencyText,
		frequencyTitle,
		resourcesText,
		updateState,
	} = useOrderConfirm();
	const { oneExecute } = useTimeout(() => {
		props.updateNextStep(false);
		toast.success(`Your request has been processed. You're about to finish!`);
	}, 1100);

	const nextStep = () => {
		sendConfirmOrder()
			.then((res) => {
				updateState('orderStepActive', OrderSection.SELECT_LEAD);
				props.updateNextStep(true);
			})
			.finally(oneExecute);
	};
	return (
		<>
			<div className="step-header">
				<h3>
					<b>Great! We have these options to offer you!</b>
				</h3>
			</div>
			<div className="step-content">
				<div className="option">
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-text-red bottom-space">
								Scope of service:
							</span>
						</div>
						<p className="pentest-option">
							<span className="underline-high">
								{resourcesText} resources:
							</span>{' '}
							codefend will analyze all the items in the company scope,{' '}
							<span className="one-pentest">
								the scope cloud be extended with
							</span>
							<span className="codefend-text-red underline-high limitations">
								some limitations.
							</span>
						</p>
					</div>
				</div>
				<div className="option">
					<img src="/codefend/frequency-1.png" alt="header-icon" />

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-text-red bottom-space">
								Frequency:
							</span>
						</div>
						<p className="pentest-option">
							<span className="underline-high">{frequencyTitle}</span>{' '}
							<span className="one-pentest">{frequencyText}</span>
						</p>
					</div>
				</div>
				<div className="option">
					<img src="/codefend/alloc-1.png" alt="header-icon" />

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-text-red bottom-space">
								Team capabilities:
							</span>
						</div>
						<p className="pentest-option">
							<span className="underline-high">
								{teamSizeText} allocation:
							</span>{' '}
							<span className="one-pentest">
								Codefend will allocate a team of 2 hackers to accomplish
								this task within 4 weeks. Individually reported issues.
							</span>
						</p>
					</div>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<PrimaryButton
						text="back"
						click={(e: any) =>
							updateState('orderStepActive', OrderSection.TEAM_SIZE)
						}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
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
