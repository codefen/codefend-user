import { type FC, useState } from 'react';
import { PrimaryButton } from '../../..';
import {
	useOrderStore,
	OrderPaymentMethod,
	OrderSection,
	userOrderFinancialResource,
} from '../../../../../data';

export const PaymentMethodOrderModal: FC = () => {
	const { paymentMethod, updateState, referenceNumber, orderId } =
		useOrderStore((state) => state);
	const { sendOrderFinancial } = userOrderFinancialResource();

	const [paymentMethodW, setPaymentMethod] =
		useState<OrderPaymentMethod>(paymentMethod);

	const backStep = () =>
		updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);

	const nextStep = () => {
		if (paymentMethodW !== OrderPaymentMethod.UNKNOWN) {
			updateState('paymentMethod', paymentMethodW);
			sendOrderFinancial(referenceNumber, paymentMethodW, orderId);
			updateState('orderStepActive', OrderSection.ANY_PAYMENT_METHOD);
		}
	};

	return (
		<>
			<div className="step-header">
				<h3>
					<b>Great! We have these options to offer you!</b>
				</h3>
			</div>
			<div className="step-content">
				<div
					className={`option ${paymentMethodW === OrderPaymentMethod.BANK_TRANSFER ? 'select-option' : ''}`}
					onClick={() =>
						setPaymentMethod(OrderPaymentMethod.BANK_TRANSFER)
					}>
					<input
						id="bank-transfer"
						type="radio"
						name="payment-methods"
						className="radio-option"
						value={paymentMethodW}
						checked={paymentMethodW === OrderPaymentMethod.BANK_TRANSFER}
						defaultChecked={
							paymentMethodW === OrderPaymentMethod.BANK_TRANSFER
						}
						onChange={() => {}}
						required
					/>
					<div className="codefend-radio"></div>
					<label htmlFor="bank-transfer" className="order-snapshot">
						<div className="top">
							<p className="codefend-color">
								Bank account / bank transfer:
							</p>
						</div>
						<span className="one-pentest">
							Small team allocation. Codefend will allocate a team of 2
							hackers to accomplish this task within 4 weeks.
							Individually reported issues.
						</span>
					</label>
				</div>

				<div
					className={`option ${paymentMethodW === OrderPaymentMethod.CARD ? 'select-option' : ''}`}
					onClick={() => setPaymentMethod(OrderPaymentMethod.CARD)}>
					<input
						id="card"
						type="radio"
						name="payment-methods"
						className="radio-option"
						value={paymentMethodW}
						checked={paymentMethodW === OrderPaymentMethod.CARD}
						defaultChecked={paymentMethodW === OrderPaymentMethod.CARD}
						onChange={() => {}}
						required
					/>
					<div className="codefend-radio"></div>
					<label htmlFor="card" className="order-snapshot">
						<div className="top">
							<p className="codefend-color">
								Credit and debit card payment:
							</p>
						</div>
						<span className="one-pentest">
							One unique scan: Codefend will perform a 4 weeks IT
							security assessment on the selected scope, one report, no
							subscription.
						</span>
					</label>
				</div>

				<div
					className={`option ${paymentMethodW === OrderPaymentMethod.CRYPTO ? 'select-option' : ''}`}
					onClick={() => setPaymentMethod(OrderPaymentMethod.CRYPTO)}>
					<input
						id="crypto"
						type="radio"
						name="payment-methods"
						className="radio-option"
						checked={paymentMethodW === OrderPaymentMethod.CRYPTO}
						defaultChecked={paymentMethodW === OrderPaymentMethod.CRYPTO}
						value={paymentMethodW}
						onChange={() => {}}
						required
					/>
					<div className="codefend-radio"></div>
					<label htmlFor="crypto" className="order-snapshot">
						<div className="top">
							<p className="codefend-color">Cryptocurrency payment:</p>
						</div>
						<span className="one-pentest">
							Codefend accepts direct cryptocurrecy payments in bitcoin,
							ethereum, litecoin, monero, solana and the stable coins
							usdc, usdt.
						</span>
					</label>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<PrimaryButton
						text="Back"
						click={backStep}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Payment"
						click={nextStep}
						className="full"
						buttonStyle="red"
						isDisabled={paymentMethodW === OrderPaymentMethod.UNKNOWN}
						disabledLoader
					/>
				</div>
			</div>
		</>
	);
};
