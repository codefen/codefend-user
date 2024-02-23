import React, { Fragment } from 'react';
import { defaultCrypto } from '../../../../data/mocks';
import { PrimaryButton, SecondaryButton } from '../..';

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
						{defaultCrypto.map((coin, i) => (
							<Fragment key={i}>
								<img
									src={`/codefend/${coin.name}.svg`}
									alt={coin.name}
								/>
							</Fragment>
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
					<div className="details gap-y-1 ">
						<h2 className="font-700 text-[16px] ">Bitcoin</h2>
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

			<div className="button-wrapper mt-6 flex justify-end gap-x-4">
				<div className="bg-blue-600 w-[25%]">
					<SecondaryButton
						text="back"
						click={(e: any) => {
							props.goBack?.();
						}}
						className=" codefend_secondary_ac w-full"
					/>
				</div>
				<div className="bg-yellow-500 w-2/6">
					<PrimaryButton
						text="transaction done, finish"
						click={() => {
							props.closeModal();
						}}
						className=" codefend_main_ac w-full"
					/>
				</div>
			</div>
		</>
	);
};

export default CryptoPayment;
