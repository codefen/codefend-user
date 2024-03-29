import { type FC, useState } from 'react';
import {
	OrderSection,
	ScopeOption,
	useOrderScope,
	useOrderStore,
} from '../../../../../data';
import { PrimaryButton } from '../../..';

export const ScopeOrderModal: FC = () => {
	const {
		scope,
		resourceType,
		resetActiveOrder,
		updateState,
		setScopeOption,
	} = useOrderStore((state) => state);

	const [scopeOptionW, setScopeOptionW] = useState<ScopeOption>(
		ScopeOption.TYPE,
	);
	const [acceptConditions, setAcceptCondition] = useState<boolean>(false);
	const [tryClick, setTryClick] = useState<boolean>(false);
	const { sendScopeOrders } = useOrderScope();

	const nextStep = () => {
		if (acceptConditions) {
			setScopeOption(scopeOptionW);

			const sendScope =
				scopeOptionW === ScopeOption.TYPE ? resourceType : 'full';
			sendScopeOrders(sendScope).then((res: any) => {
				updateState('referenceNumber', res.order.reference_number);
			});
			updateState('orderStepActive', OrderSection.FREQUENCY);
		} else {
			setTryClick(true);
			setTimeout(() => setTryClick(false), 2600);
		}
	};

	const ErrorMessage = () => {
		if (tryClick) {
			return (
				<span
					className={`block error-message ${!acceptConditions && 'vibrate'}`}>
					{`⚠️`} You must accept the terms to continue
				</span>
			);
		} else {
			return <></>;
		}
	};

	return (
		<>
			<div className="step-header">
				<h3>
					<b>Let's start a new pentest! what would like analyse?</b>
					<span>Please select the assets that you would ike to scope</span>
				</h3>
			</div>
			<div className="step-content">
				<div
					className={`option ${scopeOptionW === ScopeOption.TYPE && 'select-option'}`}>
					<input
						id="scope-resources"
						name="scopeOption"
						type="radio"
						value={ScopeOption.TYPE}
						className="radio-option"
						defaultChecked={scopeOptionW === ScopeOption.TYPE}
						onClick={() => setScopeOptionW(ScopeOption.TYPE)}
					/>
					<div className="codefend-radio"></div>
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
					className={`option ${scopeOptionW === ScopeOption.ALL && 'select-option'}`}>
					<input
						id="all-scope-resources"
						name="scopeOption"
						type="radio"
						value={ScopeOption.ALL}
						className="radio-option"
						defaultChecked={scopeOptionW === ScopeOption.ALL}
						onClick={() => setScopeOptionW(ScopeOption.ALL)}
					/>
					<div className="codefend-radio"></div>
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
					<PrimaryButton
						text="Cancel"
						click={resetActiveOrder}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue to the next step"
						click={nextStep}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
