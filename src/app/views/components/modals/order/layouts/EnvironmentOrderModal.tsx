import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../../..';
import {
	useOrderStore,
	OrderSection,
	OrderEnvironment,
} from '../../../../../data';

export const EnvironmentOrderModal: React.FC<any> = () => {
	const { environmentOrder, updateState } = useOrderStore((state) => state);

	const [environmentOrderW, setOrderEnvironment] =
		useState<OrderEnvironment>(environmentOrder);

	const nextStep = () => {
		updateState('environmentOrder', environmentOrderW);
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
					className={`option block-xl show-both-borders order-pointer ${environmentOrderW === OrderEnvironment.TEST && 'select-option'}`}
					onClick={() => setOrderEnvironment(OrderEnvironment.TEST)}>
					<input
						id="test-environment"
						name="environmentTest"
						type="radio"
						className="radio-option"
						value={OrderEnvironment.TEST}
						checked={environmentOrderW === OrderEnvironment.TEST}
						readOnly
					/>
					<div className="codefend-radio"></div>
					<label
						htmlFor="test-environment"
						className="order-snapshot order-pointer">
						<div className="top">
							<p>Production environment / careful test</p>
						</div>
						<span className="one-pentest">
							All or some of the resources are in a production
							environment. Codefend's professionals will be extra careful
							and will avoid risk.
						</span>
					</label>
				</div>
				<div
					onClick={() => setOrderEnvironment(OrderEnvironment.PRODUCTION)}
					className={`option block-xl show-both-borders order-pointer ${environmentOrderW === OrderEnvironment.PRODUCTION && 'select-option'}`}>
					<input
						id="production-environment"
						name="environmentTest"
						type="radio"
						className="radio-option"
						value={OrderEnvironment.PRODUCTION}
						checked={environmentOrderW === OrderEnvironment.PRODUCTION}
						readOnly
					/>
					<div className="codefend-radio"></div>
					<label
						htmlFor="production-environment"
						className="order-snapshot order-pointer">
						<div className="top">
							<p>Test environment / offensive test</p>
						</div>
						<span className="one-pentest">
							All the resources or infrastructure is in a test
							environment. Codefend's professionals may use more
							disruptive or risky techniques.
						</span>
					</label>
				</div>
			</div>
			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<SecondaryButton
						text="back"
						click={() =>
							updateState('orderStepActive', OrderSection.SELECT_LEAD)
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
