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
					className={`option  cursor-pointer`}
					onClick={() => {
						handleSelectedOption('scope');
					}}>
					<img
						className={`${
							isOptionSelected('scope') ? 'visible' : 'invisible'
						}`}
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color">Scope of service:</span>
							<p>
								All company resources: codefend will analyze all the
								items in the company scope,
							</p>
						</div>
						<span className="text-[#9b9a9a]">
							the scope cloud be extended with
						</span>
						<span className="codefend-color underline">
							some limitations.
						</span>
					</div>
				</div>
				<div
					className={`option cursor-pointer`}
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

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color"> Frequency:</span>
						</div>
						<span className="text-[#9b9a9a]">
							One unique scan: Codefend will perform a 4 weeks IT
							secuirty assessment on the selected scope, one report, no
							subscription.
						</span>
					</div>
				</div>
				<div
					className={`option cursor-pointer`}
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

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color">Team capabilities:</span>
						</div>
						<span className="text-[#9b9a9a]">
							Small team allocation: Codefend will allocate a team of 2
							hackers to accomplish this task within 4 weeks.
							Individually reported issues.
						</span>
					</div>
				</div>
			</div>
			{/* <div class="mt-20 flex items-center gap-x-2 show-border  px-10">
        <input type="checkbox" alt="checkbox" class="" />
        <span class="codefend-color">I confirm I have authorization</span>
        <span class="text-black">and I’ve read and accept the disclaimer.</span>
      </div> */}

			<div className="button-wrapper mt-6 flex justify-end gap-x-4">
				<div className="bg-blue-600 w-[25%]">
					<SecondaryButton
						text="back"
						click={(e: any) => {
							props.setActiveTab('team size');
						}}
						className=" codefend_secondary_ac w-full"
					/>
				</div>
				<div className="bg-yellow-500 w-2/6">
					<PrimaryButton
						text="Continue to the next step"
						click={() => {
							props.setActiveTab('payment method');
						}}
						className=" codefend_main_ac w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default OrderReview;
