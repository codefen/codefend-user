import React, { useState } from 'react';
import { OrderSection, ScopeOption, useOrderStore } from '../../../../../data';
import { PrimaryButton, SecondaryButton } from '../../..';

export const ScopeOrderModal = () => {
	const {
		scope,
		resourceType,
		setScopeOption,
		resetActiveOrder,
		updateState,
	} = useOrderStore((state) => state);

	const [scopeOptionW, setScopeOptionW] = useState<ScopeOption>(
		scope.scopeOption,
	);
	const [acceptConditions, setAcceptCondition] = useState<boolean>(false);
	const [tryClick, setTryClick] = useState<boolean>(false);

	const nextStep = () => {
		if (acceptConditions) {
			setScopeOption(scopeOptionW);

			updateState('orderStepActive', OrderSection.FREQUENCY);
		} else {
			setTryClick(true);
			setTimeout(() => setTryClick(false), 2500);
		}
	};

	const ErrorMessage = () => {
		if (tryClick) {
			return (
				<span className="block error-message">
					You must accept the terms to continue
				</span>
			);
		} else {
			return <></>;
		}
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>Let's start a new pentest! what would like analyse?</b>
					<span>Please select the assets that you would ike to scope</span>
				</h3>
			</div>
			<div className="scope-content show-both-borders">
				<div
					className={`option block-xll show-both-borders ${scopeOptionW === ScopeOption.TYPE && 'select-option'}`}>
					<input
						id="scope-resources"
						name="scopeOption"
						type="radio"
						value={ScopeOption.TYPE}
						className="radio-option"
						defaultChecked={scopeOptionW === ScopeOption.TYPE}
						onClick={() => setScopeOptionW(ScopeOption.TYPE)}
					/>
					<label htmlFor="scope-resources" className="order-snapshot">
						<div className="top">
							<p>
								{' '}
								I want to analyze all my team {resourceType.valueOf()}{' '}
								resources
								<span className="codefend-text-red order-dash-space">
									- {scope.totalResources} resources:
								</span>
							</p>
						</div>
						<span className="one-pentest">
							This option allocates the resources exclusively on your
							{resourceType.valueOf()} resources.
						</span>
					</label>
				</div>
				<div
					className={`option block-xll show-both-borders ${scopeOptionW === ScopeOption.ALL && 'select-option'}`}>
					<input
						id="all-scope-resources"
						name="scopeOption"
						type="radio"
						value={ScopeOption.ALL}
						className="radio-option"
						defaultChecked={scopeOptionW === ScopeOption.ALL}
						onClick={() => setScopeOptionW(ScopeOption.ALL)}
					/>
					<label htmlFor="all-scope-resources" className="order-snapshot">
						<div className="top">
							<p>
								{' '}
								I want to analyze all my team resources{' '}
								<span className="codefend-text-red order-dash-space">
									{' '}
									- {scope.totalAllResources} resources:
								</span>
							</p>
						</div>
						<span className="one-pentest">
							This option allocates the resources in all the resources
							loaded in the app.
						</span>
					</label>
				</div>
			</div>
			<div className="scope-confirm">
				<input
					id="confirmation"
					type="checkbox"
					alt="checkbox"
					className="codefend-checkbox confirm-check"
					defaultChecked={acceptConditions}
					onChange={() => setAcceptCondition(!acceptConditions)}
				/>
				<label htmlFor="confirmation" className="confirm-label">
					<span
						className="codefend-text-red underline-high disclaimers"
						title="Open disclaimers">
						I confirm I have authorization
					</span>
					<span>and I’ve read and accept the disclaimer.</span>
				</label>
				<ErrorMessage />
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<SecondaryButton
						text="cancel"
						click={resetActiveOrder}
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
