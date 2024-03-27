import { useRef, useState } from 'react';
import {
	CryptoPayment,
	OrderPaymentMethod,
	OrderSection,
	OrderTeamSize,
	defaultCrypto,
	useOrderCryptoFinancial,
	useOrderStore,
} from '../../../../../data';
import { CopiedIcon, CopyIcon, PrimaryButton } from '../../..';

export const CryptoPaymentModal = () => {
	const {
		getCryptoFinancialInfo,
		cryptoBtc,
		cryptoEth,
		cryptoLtc,
		cryptoMonero,
		cryptoSol,
		cryptoUsdC,
		cryptoUsdT,
	} = useOrderCryptoFinancial();

	const { teamSize, updateState } = useOrderStore((state) => state);
	const [cryptoAddress, setCryptoAddress] = useState(
		'bc1qxypfpkrcwpszp20azl804nuxn8n95cf6g0rgy2',
	);
	const [copied, setCopied] = useState(false);
	const [transactionID, setTransactionID] = useState('');
	const [trySend, setTrySend] = useState(false);
	const [crypto, setCrypto] = useState<CryptoPayment>(CryptoPayment.BITCOIN);
	const [walletId, setWalletId] = useState(
		'bc1qxypfpkrcwpszp20azl804nuxn8n95cf6g0rgy2',
	);

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
		setTrySend(true);
		setTimeout(() => setTrySend(false), 2300);
	};

	Object.values(CryptoPayment).map((key: any) => console.log({ key }));

	const values = {
		[CryptoPayment.BITCOIN.valueOf()]: CryptoPayment.BITCOIN,
		[CryptoPayment.ETHERIUM.valueOf()]: CryptoPayment.ETHERIUM,
		[CryptoPayment.LITECOIN.valueOf()]: CryptoPayment.LITECOIN,
		[CryptoPayment.MONERO.valueOf()]: CryptoPayment.MONERO,
		[CryptoPayment.SOLANA.valueOf()]: CryptoPayment.SOLANA,
		[CryptoPayment.USDC.valueOf()]: CryptoPayment.USDC,
		[CryptoPayment.USDT.valueOf()]: CryptoPayment.USDT,
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
						{Object.values(CryptoPayment).map((coin, i) => (
							<>
								{coin === 'USDT' && (
									<div className="crypto-usd-dash"></div>
								)}
								<img
									key={i}
									src={`/codefend/${coin.toLowerCase()}.svg`}
									alt={coin.toLowerCase()}
									className={`${crypto.valueOf() === coin && 'selected-crypto'}`}
									onClick={() => {
										setCrypto(values[coin]);
									}}
								/>
							</>
						))}
					</div>
				</div>
				<div className="payment-details">
					<div className="qrcode">
						<img
							src="/codefend/QR.svg"
							alt="qrcode-icon"
							className="qr-img"
						/>
					</div>
					<div className="details space">
						<div className="top">
							<p className="crypto-payment">
								You hace selected Bitcoin{' '}
								<span className="codefend-text-red">address:</span>
							</p>
						</div>

						<div className="address-container select-option">
							<span className="address-text">{walletId}</span>

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
