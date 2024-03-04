import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../..';

type OrderReviewProps = {
	setActiveTab: Function;
};

type OrderReviewOption = 'scope' | 'frequency' | 'team';

const OrderReview = (props: OrderReviewProps) => {
	const [selectedOption, setSelectedOption] = useState<any>('scope');

	const handleSelectedOption = (option: OrderReviewOption) => {
		if (option === selectedOption) return;
		if (option === 'scope') {
			setSelectedOption('scope');
		} else if (option === 'frequency') {
			setSelectedOption('frequency');
		} else if (option === 'team') {
			setSelectedOption('team');
		} else {
			setSelectedOption(null);
		}
	};

	const isOptionSelected = (option: OrderReviewOption) =>
		selectedOption === option;

	return (
		<div>
			<div className="option-header">
				<h1>Great! We have these options to offer you!</h1>
			</div>
			<div className="scope-content">
				<div
					className={`option order-pointer`}
					onClick={() => handleSelectedOption('scope')}>
					<img
						className={`${
							isOptionSelected('scope') ? 'visible' : 'invisible'
						}`}
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-color">Scope of service:</span>
							<p>
								All company resources: codefend will analyze all the
								items in the company scope,
							</p>
						</div>
						<span className="one-pentest">
							the scope cloud be extended with
						</span>
						<span className="codefend-color underline-high ">
							some limitations.
						</span>
					</div>
				</div>
				<div
					className={`option order-pointer`}
					onClick={() => {
						handleSelectedOption('frequency');
					}}>
					<img
						className={`${
							isOptionSelected('frequency') ? 'visible' : 'invisible'
						}`}
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-color"> Frequency:</span>
						</div>
						<span className="one-pentest">
							One unique scan: Codefend will perform a 4 weeks IT
							secuirty assessment on the selected scope, one report, no
							subscription.
						</span>
					</div>
				</div>
				<div
					className={`option order-pointer`}
					onClick={() => {
						handleSelectedOption('team');
					}}>
					<img
						className={`${
							isOptionSelected('team') ? 'visible' : 'invisible'
						}`}
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="order-snapshot">
						<div className="top">
							<span className="codefend-color">Team capabilities:</span>
						</div>
						<span className="one-pentest">
							Small team allocation: Codefend will allocate a team of 2
							hackers to accomplish this task within 4 weeks.
							Individually reported issues.
						</span>
					</div>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<SecondaryButton
						text="back"
						click={(e: any) => {
							props.setActiveTab('team size');
						}}
						className=" codefend_secondary_ac full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue to the next step"
						click={() => {
							props.setActiveTab('payment method');
						}}
						className=" codefend_main_ac full"
					/>
				</div>
			</div>
		</div>
	);
};

export default OrderReview;
