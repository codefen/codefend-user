import { useState } from 'react';
import {
	OrderPaymentMethod,
	OrderSection,
	OrderTeamSize,
	defaultCrypto,
	useOrderStore,
} from '../../../../../data';
import { CopiedIcon, CopyIcon, PrimaryButton } from '../../..';

export const CryptoPaymentModal = () => {
	const { teamSize, updateState } = useOrderStore((state) => state);
	const [cryptoAddress, setCryptoAddress] = useState(
		'bc1qxypfpkrcwpszp20azl804nuxn8n95cf6g0rgy2',
	);
	const [copied, setCopied] = useState(false);
	const [transactionID, setTransactionID] = useState('');
	const [trySend, setTrySend] = useState(false);

	const copyTextToClipboard = () => {
		navigator.clipboard.writeText(cryptoAddress).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const finalPrice = () => {
		if (teamSize === OrderTeamSize.SMALL) return '$1,500';
		if (teamSize === OrderTeamSize.MID) return '$4,500';
		return '$13,500';
	};

	const backStep = () => {
		updateState('orderStepActive', OrderSection.PAYMENT);
	};

	const finishStep = () => {
		let someActionWithThis = transactionID;
		if (someActionWithThis.trim()) {
			updateState('paymentMethod', OrderPaymentMethod.FINISHED);
		} else {
			setTrySend(true);
			setTimeout(() => setTrySend(false), 2300);
		}
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>Select your payment cryptocurrency:</b>
				</h3>
			</div>
			<div className="scope-content crypto-payment">
				<div className="order-img-wrapper show-both-borders ">
					<div className="order-img">
						{defaultCrypto.map((coin, i) => (
							<img
								key={i}
								src={`/codefend/${coin.name}.svg`}
								alt={coin.name}
							/>
						))}
						<img
							src="/codefend/usdc.svg"
							className="crypto-usd crypto-usd-dash"
							alt="coin-icon"
						/>
						<img
							src="/codefend/tether.svg"
							className="crypto-usd"
							alt="tether-icon"
						/>
					</div>
				</div>
				<div className="payment-details">
					<div className="qrcode">
						<img src="/codefend/QR.svg" alt="qrcode-icon" />
					</div>
					<div className="details space">
						<div className="top">
							<p className="crypto-payment">
								You hace selected Bitcoin{' '}
								<span className="codefend-text-red">address:</span>
							</p>
						</div>

						<div className="address-container select-option">
							<span className="address-text">
								bc1qxypfpkrcwpszp20azl804nuxn8n95cf6g0rgy2
							</span>

							<div
								className={`copy-icon order-pointer ${copied && 'copied'}`}
								onClick={copyTextToClipboard}>
								{copied ? (
									<CopiedIcon width={1.25} height={1.25} />
								) : (
									<CopyIcon width={1.25} height={1.25} isButton />
								)}
							</div>
						</div>

						<input
							type="text"
							placeholder="Please complete with the transaction ID"
							id="crypto-transaction-id"
							onChange={(e: any) => setTransactionID(e.target.value)}
						/>
						{trySend && (
							<span className="error-input vibrate">
								You must write the id of the transaction
							</span>
						)}
					</div>
				</div>

				<div className="total-payment show-both-borders">
					<span>Total to be paid in USD</span>
					<span>{finalPrice()}</span>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<PrimaryButton
						text="back"
						click={backStep}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Verify transaction"
						click={finishStep}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
