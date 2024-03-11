import React, { useState } from 'react';
import {
	ChipIcon,
	ModalButtons,
	PrimaryButton,
	SecondaryButton,
} from '../../..';
import {
	OrderPaymentMethod,
	OrderSection,
	OrderTeamSize,
	useOrderStore,
} from '../../../../../data';

export const CardPaymentModal = () => {
	const { teamSize, updateState } = useOrderStore((state) => state);

	const [cardInfo, setCardInfo] = useState({
		cardOwner: '',
		cardNumber: '',
		cardDueDate: '',
		cardDueYear: '',
		cardCVC: '',
	});

	const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setCardInfo((state: any) => ({
			...state,
			[e.target.name]: e.target.value,
		}));

	const finalPrice = () => {
		if (teamSize === OrderTeamSize.SMALL) return '$1,500';
		if (teamSize === OrderTeamSize.MID) return '$4,500';
		return '$13,500';
	};

	const submitCardPayment = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		updateState('paymentMethod', OrderPaymentMethod.FINISHED);
	};

	const backStep = () => {
		updateState('orderStepActive', OrderSection.PAYMENT);
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>Please enter your payment information</b>
				</h3>
			</div>
			<form className="bank-card-payment-form" onSubmit={submitCardPayment}>
				<div className="scope-content card-payment">
					<div className="order-img-wrapper fake-space show-both-borders">
						<span>
							Imagine that there are images of cards here (because I
							don't have them)
						</span>
					</div>
					<div className="bank-card-info">
						<input
							type="text"
							placeholder="Albert Hofmann"
							maxLength={100}
							name="cardOwner"
							required
							onChange={handleOnchange}
						/>
						<input
							type="text"
							placeholder="4543 4409 7344 6024"
							name="cardNumber"
							maxLength={19}
							minLength={14}
							pattern="[0-9 ]*"
							required
							onChange={handleOnchange}
						/>
						<div className="card-extra-info">
							<input
								type="text"
								placeholder="01 - January"
								name="cardDueDate"
								required
								onChange={handleOnchange}
							/>
							<input
								type="text"
								placeholder="2030"
								pattern="[0-9]*"
								name="cardDueYear"
								maxLength={4}
								required
								onChange={handleOnchange}
							/>
							<input
								type="password"
								placeholder="CVC"
								name="cardCVC"
								minLength={3}
								maxLength={4}
								required
								onChange={handleOnchange}
							/>
						</div>
					</div>

					<div className="total-payment show-both-borders">
						<span>Total to be paid in USD</span>
						<span>{finalPrice()}</span>
					</div>
				</div>

				<ModalButtons
					close={backStep}
					closeText="Back"
					confirmText="Payment"
					isDisabled={false}
					boxStyle="button-wrapper next-btns"
				/>
			</form>
		</>
	);
};
