import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../..';
import {
	useOrderStore,
	ScopeOption,
	OrderFrequency,
	OrderTeamSize,
	OrderSection,
} from '../../../../data';

export const OrderReviewModal = () => {
	const { resourceType, scope, frequency, teamSize, updateState } =
		useOrderStore((state) => state);

	const resourcesText =
		scope.scopeOption === ScopeOption.ALL
			? 'All company '
			: `Only ${resourceType.valueOf()} `;

	const frequencyTitle =
		frequency === OrderFrequency.ONE_ORDER
			? 'One unique scan:'
			: 'Permanent surveillance:';

	const frequencyText =
		frequency === OrderFrequency.ONE_ORDER
			? `Codefend will perform a 4 weeks IT secuirty assessment on the selected scope, one report, no subscription.`
			: `Codefend will perform out a maximum of 12 IT secuirty assessment per year.`;

	let teamSizeText = '';
	if (teamSize === OrderTeamSize.SMALL) teamSizeText = 'Small team';
	if (teamSize === OrderTeamSize.MID) teamSizeText = 'Medium team';
	if (teamSize === OrderTeamSize.FULL) teamSizeText = 'Full team';

	return (
		<>
			<div className="option-header">
				<h3>
					<b>Great! We have these options to offer you!</b>
				</h3>
			</div>
			<div className="scope-content">
				<div className="option">
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-text-red">
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
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-text-red">Frequency:</span>
						</div>
						<p className="pentest-option">
							<span className="underline-high">{frequencyTitle}</span>
							<span className="one-pentest">{frequencyText}</span>
						</p>
					</div>
				</div>
				<div className="option">
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-text-red">
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
					<SecondaryButton
						text="back"
						click={(e: any) =>
							updateState('orderStepActive', OrderSection.TEAM_SIZE)
						}
						className="full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue to the next step"
						click={() =>
							updateState('orderStepActive', OrderSection.SELECT_LEAD)
						}
						className="full"
					/>
				</div>
			</div>
		</>
	);
};
