import React, { useState } from 'react';
import { OrderSection, useOrderStore } from '../../../../../data';
import { PrimaryButton, SecondaryButton } from '../../..';

export const LeadOrderModal = () => {
	const { leadName, updateState } = useOrderStore((state) => state);

	const [leadNameW, setLeadName] = useState<string>(leadName);

	const nextStep = () => {
		updateState('leadName', leadNameW);
		updateState('orderStepActive', OrderSection.ENVIRONMENT);
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>Please select your desired team to conduct this order:</b>
				</h3>
			</div>
			<div className="scope-content show-both-borders">
				<div
					className={`option block-xll show-both-borders order-pointer ${
						leadNameW === '@chris' && `select-option`
					}`}
					onClick={() => setLeadName('@chris')}>
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>
					<div className="order-snapshot">
						<div className="top">
							<p>
								Codefend private team |{' '}
								<span className="codefend-text-red"> lead: </span>
								@chris
							</p>
						</div>
						<span className="one-pentest">
							An internal selection of professional/s that best fit your
							needs.
						</span>
					</div>
				</div>
				<div
					className={`option block-xll show-both-borders order-pointer ${
						leadNameW === '@edd' && `select-option`
					}`}
					onClick={() => setLeadName('@edd')}>
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>
					<div className="order-snapshot">
						<div className="top">
							<p>
								Offensive Security Services |{' '}
								<span className="codefend-text-red"> lead: </span>
								@edd
							</p>
						</div>
						<span className="one-pentest">
							All the resources or infrastructure is in a test
							environment. Codefend's
						</span>
					</div>
				</div>
				<div
					className={`option block-xll show-both-borders order-pointer ${
						leadNameW === '@onesto' && `select-option`
					}`}
					onClick={() => setLeadName('@onesto')}>
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>
					<div className="order-snapshot">
						<div className="top">
							<p>
								Gaspar Onesto |{' '}
								<span className="codefend-text-red"> lead: </span>
								@onesto
							</p>
						</div>
						<span className="one-pentest">
							All the resources or infrastructure is in a test
							environment. Codefend's
						</span>
					</div>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<SecondaryButton
						text=""
						click={() => {}}
						className="full order-default bg-transparent"
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
