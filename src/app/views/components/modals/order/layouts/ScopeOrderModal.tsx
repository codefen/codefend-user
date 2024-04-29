import { type FC, useState } from 'react';
import {
	OrderSection,
	ScopeOption,
	useOrderScope,
	useOrderStore,
} from '../../../../../data';
import useTimeout from '#commonHooks/useTimeout.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';

export const ScopeOrderModal: FC = () => {
	const {
		scope,
		resourceType,
		resetActiveOrder,
		updateState,
		setScopeOption,
	} = useOrderStore((state) => state);

	const [scopeOptionW, setScopeOptionW] = useState<ScopeOption>(
		ScopeOption.UNKNOWN,
	);
	const [acceptConditions, setAcceptCondition] = useState<boolean>(false);
	const [tryClick, setTryClick] = useState<boolean>(false);
	const { sendScopeOrders } = useOrderScope();
	const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
	const nextStep = () => {
		if (acceptConditions && scopeOptionW !== ScopeOption.UNKNOWN) {
			setScopeOption(scopeOptionW);

			const sendScope =
				scopeOptionW === ScopeOption.TYPE ? resourceType : 'full';
			sendScopeOrders(sendScope).then((res: any) => {
				updateState('referenceNumber', res.order.reference_number);
			});
			updateState('orderStepActive', OrderSection.FREQUENCY);
		} else if (!acceptConditions) {
			setTryClick(true);
			oneExecute();
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
					className={`option ${scopeOptionW === ScopeOption.TYPE && 'select-option'}`}
					onClick={() => setScopeOptionW(ScopeOption.TYPE)}>
					<input
						id="scope-resources"
						name="scopeOption"
						type="radio"
						className="radio-option"
						checked={scopeOptionW === ScopeOption.TYPE}
						onChange={() => {}}
					/>
					<div className="codefend-radio"></div>
					<label htmlFor="scope-resources" className="order-snapshot">
						<div className="top">
							<p>
								{' '}
								I want to analyze all my team {resourceType.valueOf()}{' '}
								resources
								<span className="alt-color order-dash-space">
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
					className={`option ${scopeOptionW === ScopeOption.ALL && 'select-option'}`}
					onClick={() => setScopeOptionW(ScopeOption.ALL)}>
					<input
						id="all-scope-resources"
						name="scopeOption"
						type="radio"
						className="radio-option"
						checked={scopeOptionW === ScopeOption.ALL}
						onChange={() => {}}
					/>
					<div className="codefend-radio"></div>
					<label htmlFor="all-scope-resources" className="order-snapshot">
						<div className="top">
							<p>
								{' '}
								I want to analyze all my team resources{' '}
								<span className="alt-color order-dash-space">
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
