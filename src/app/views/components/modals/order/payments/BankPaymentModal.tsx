import { PrimaryButton } from '../../..';
import {
	OrderPaymentMethod,
	OrderSection,
	OrderTeamSize,
	useOrderStore,
} from '../../../../../data';

export const BankPaymentModal = () => {
	const { teamSize, updateState } = useOrderStore((state) => state);

	const BankInfo: React.FC<any> = (props) => {
		return (
			<p>
				<span className="codefend-text-red underline-high space">
					{props.keyV}
				</span>{' '}
				{props.value}
			</p>
		);
	};

	const backStep = () => {
		updateState('orderStepActive', OrderSection.PAYMENT);
	};
	const finishStep = () => {};

	const finalPrice = () => {
		if (teamSize === OrderTeamSize.SMALL) return '$1,500';
		if (teamSize === OrderTeamSize.MID) return '$4,500';
		return '$13,500';
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>Please select your desired option to see the details:</b>
				</h3>
			</div>
			<div className="scope-content show-both-borders bank-payment">
				<div className="payment-bank-options show-bottom-border">
					<div className="payment-bank">
						<div className="top">
							<p>Receiving Bank</p>
						</div>

						<BankInfo keyV="SWIFT / BIC CODE:" value="CHFGUS44021" />
						<BankInfo keyV="ABA Routing Number:" value="091311229" />
						<BankInfo keyV="Bank Name:" value="Choice Financial Group" />
						<BankInfo
							keyV="Bank Address:"
							value="4501 23rd Avenue S Fargo, ND 58104, USA"
						/>
					</div>
					<div className="payment-bank show-left-border">
						<div className="top">
							<p>Beneficiary</p>
						</div>

						<BankInfo
							keyV="IBAN / Account Number:"
							value="202399538882"
						/>
						<BankInfo keyV="Beneficiary Name:" value="Codefend LLC" />
						<BankInfo
							keyV="Beneficiary Address:"
							value="651 N Broad St, Suite 201 Middletown DE 19709 USA"
						/>
					</div>
				</div>

				<div className="total-payment">
					<span>Total to be paid in USD</span>
					<span>{finalPrice()}</span>
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
						text="I have made the payment"
						click={finishStep}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
