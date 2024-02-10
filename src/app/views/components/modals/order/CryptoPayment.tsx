import React from 'react';
import { defaultCrypto } from '../../../../data/mocks';

type CryptoPaymentProps = {
	goBack?: Function;
	closeModal: Function;
};

const CryptoPayment = (props: CryptoPaymentProps) => {
	return (
		<>
			<div className="option-header">
				<h1>Select your payment cryptocurrency:</h1>
			</div>
			<div className="scope-content">
				<div className="flex items-center  show-border">
					<div className="flex items-center gap-x-4 justify-between grow py-4 px-8">
						{defaultCrypto.map((coin) => (
							<img src={`/codefend/${coin.name}.svg`} alt={coin.name} />
						))}
					</div>
					<div className="flex items-center gap-x-8 border-l h-full border-gray-400 px-8 ">
						<img src="/codefend/usdc.svg" alt="coin-icon" />
						<img src="/codefend/tether.svg" alt="tether-icon" />
					</div>
				</div>
				<div className="payment-details">
					<div className="qrcode bg-white p-2 shadow-md">
						<img src="/codefend/QR.svg" alt="qrcode-icon" />
					</div>
					<div className="details gap-y-1">
						<h2 className="font-700 text-[16px] text-black">Bitcoin</h2>
						<span>Price in USD: $1,500</span>
						<span>Price in BTC: 0.03863912</span>
						<div className="flex items-center gap-x-4 py-4 show-border my-4">
							<span className="codefend-color underline">Address: </span>
							<span>bc1qxypfpkrcwpszp20azl804nuxn8n95cf6g0rgy2</span>
						</div>
						<p>
							Please, remember to add a note with your email address
							(user@email.com) in order to help us identify your
							transaction.
						</p>
					</div>
				</div>
			</div>

			<div className="button-wrapper mt-14 flex justify-end">
				<button
					// type="button"
					// disabled={isDeletingResource()}
					onClick={() => {
						props.goBack?.();
					}}
					className="log-inputs text-gray focus:outline-none w-2/6 px-4 mr-2 py-3 text-sm tracking-wide text-white transition-colors duration-300">
					back
				</button>
				<button
					onClick={() => {
						props.closeModal();
					}}
					// type="submit"
					// disabled={isDeletingResource()}
					className="log-inputs flex items-center gap-x-2 text-white focus:outline-none bg-codefend px-6 w-2.5/6 py-3 text-sm transition-colors tracking-wide duration-300 font-400 text-">
					{/* {(props.isDeleting || isDeletingResource()) && <ButtonLoader />} */}
					transaction done, finish
				</button>
			</div>
		</>
	);
};

export default CryptoPayment;
