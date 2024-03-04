import React, { useState } from 'react';
import CryptoPayment from './CryptoPayment';
import { PrimaryButton, SecondaryButton } from '../..';

type PaymentMethodProps = {
	setActiveTab: Function;
	closeModal: Function;
};

type PaymentMethodOption = 'crypto' | 'card' | 'bank transfer';

const PaymentMethod = (props: PaymentMethodProps) => {
	const [selectedOption, setSelectedOption] =
		useState<PaymentMethodOption | null>('crypto');
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
								className="radio-option"
								checked={isOptionChecked('crypto')}
								onChange={(value) => {
									handleSelectedOption('crypto');
								}}
							/>
							<label htmlFor="crypto" className="order-snapshot">
								<div className="top">
									<span className="codefend-color">
										Cryptocurrency payment:
									</span>
								</div>
								<span className="one-pentest">
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
								className="radio-option"
								checked={isOptionChecked('card')}
								onChange={(value) => {
									handleSelectedOption('card');
								}}
							/>
							<label htmlFor="card" className="order-snapshot">
								<div className="top">
									<span className="codefend-color">
										Credit and debit card payment:
									</span>
								</div>
								<span className="one-pentest">
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
								className="radio-option"
								checked={isOptionChecked('bank transfer')}
								onChange={(value) => {
									handleSelectedOption('bank transfer');
								}}
							/>
							<label htmlFor="bank-transfer" className="order-snapshot">
								<div className="top">
									<span className="codefend-color">
										Bank account / bank transfer:
									</span>
								</div>
								<span className="one-pentest">
									Small team allocation. Codefend will allocate a team
									of 2 hackers to accomplish this task within 4 weeks.
									Individually reported issues.
								</span>
							</label>
						</div>
					</div>

					<div className="button-wrapper next-btns">
						<div className="secondary-container">
							<SecondaryButton
								text="back"
								click={(e: any) => {
									props.setActiveTab('order review');
								}}
								className="codefend_secondary_ac full"
							/>
						</div>
						<div className="primary-container">
							<PrimaryButton
								text="Proceed to payment"
								click={() => {
									setShowTransactionView(true);
								}}
								className="codefend_main_ac full"
							/>
						</div>
					</div>
				</>
			) : (
				<>
					<CryptoPayment
						goBack={() => setShowTransactionView(false)}
						closeModal={props.closeModal}
					/>
				</>
			)}
		</div>
	);
};

export default PaymentMethod;
