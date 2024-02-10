import React, { useState } from 'react';
import CryptoPayment from './CryptoPayment';

type PaymentMethodProps = {
	setActiveTab: Function;
	closeModal: Function;
};

type PaymentMethodOption = 'crypto' | 'card' | 'bank transfer';

const PaymentMethod = (props: PaymentMethodProps) => {
	const [selectedOption, setSelectedOption] = useState<any>(null);
	const [showTransactionView, setShowTransactionView] = useState(false);

	const handleSelectedOption = (option: PaymentMethodOption) => {
		if (option === selectedOption) return;
		if (option === 'crypto') {
			setSelectedOption('crypto');
		} else if (option === 'card') {
			setSelectedOption('card');
		} else if (option === 'bank transfer') {
			setSelectedOption('bank transfer');
		} else {
			setSelectedOption(null);
		}
	};

	const isOptionChecked = (option: PaymentMethodOption) =>
		selectedOption === option;

	return (
		<div>
			{!showTransactionView ? (
				<>
					<div className="option-header">
						<h1>Great! We have these options to offer you!</h1>
					</div>
					<div className="scope-content">
						<div className="option show-border">
							<input
								id="crypto"
								type="radio"
								className=""
								checked={isOptionChecked('crypto')}
								onChange={(value) => {
									handleSelectedOption('crypto');
								}}
							/>
							<label htmlFor="crypto" className="flex flex-col">
								<div className="top">
									<span className="codefend-color">
										Cryptocurrency payment:
									</span>
								</div>
								<span className="text-[#9b9a9a]">
									Codefend accepts direct cryptocurrecy payments in
									bitcoin, ethereum, litecoin, monero, solana and the
									stable coins usdc, usdt.
								</span>
							</label>
						</div>
						<div className="option bottom-border">
							<input
								id="card"
								type="radio"
								className=""
								checked={isOptionChecked('card')}
								onChange={(value) => {
									handleSelectedOption('card');
								}}
							/>
							<label htmlFor="card" className="flex flex-col">
								<div className="top">
									<span className="codefend-color">
										Credit and debit card payment:
									</span>
								</div>
								<span className="text-[#9b9a9a]">
									One unique scan: Codefend will perform a 4 weeks IT
									secuirty assessment on the selected scope, one
									report, no subscription.
								</span>
							</label>
						</div>
						<div className="option bottom-border">
							<input
								id="bank-transfer"
								type="radio"
								className=""
								checked={isOptionChecked('bank transfer')}
								onChange={(value) => {
									handleSelectedOption('bank transfer');
								}}
							/>
							<label htmlFor="bank-transfer" className="flex flex-col">
								<div className="top">
									<span className="codefend-color">
										Bank account / bank transfer:
									</span>
								</div>
								<span className="text-[#9b9a9a]">
									Small team allocation. Codefend will allocate a team
									of 2 hackers to accomplish this task within 4 weeks.
									Individually reported issues.
								</span>
							</label>
						</div>
					</div>

					<div className="button-wrapper mt-14 flex justify-end">
						<button
							// type="button"
							// disabled={isDeletingResource()}
							onClick={() => {
								props.setActiveTab('order review');
							}}
							className="log-inputs text-gray focus:outline-none w-2/6 px-4 mr-2 py-3 text-sm tracking-wide text-white transition-colors duration-300">
							back
						</button>
						<button
							onClick={() => {
								setShowTransactionView(true);
							}}
							// type="submit"
							// disabled={isDeletingResource()}
							className="log-inputs flex items-center gap-x-2 text-white focus:outline-none bg-codefend px-6 w-2.5/6 py-3 text-sm transition-colors tracking-wide duration-300 font-400 text-">
							{/* {(props.isDeleting || isDeletingResource()) && <ButtonLoader />} */}
							Proceed to payment
						</button>
					</div>
				</>
			) : (
				<>
					<CryptoPayment
						goBack={() => {
							setShowTransactionView(false);
						}}
						closeModal={props.closeModal}
					/>
				</>
			)}
		</div>
	);
};

export default PaymentMethod;
