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
				<div className="order-img-wrapper  show-border">
					<div className="order-img">
						{defaultCrypto.map((coin, i) => (
							<Fragment key={i}>
								<img
									src={`/codefend/${coin.name}.svg`}
									alt={coin.name}
								/>
							</Fragment>
						))}
					</div>
					<div className="order-img-btc">
						<img src="/codefend/usdc.svg" alt="coin-icon" />
						<img src="/codefend/tether.svg" alt="tether-icon" />
					</div>
				</div>
				<div className="payment-details">
					<div className="qrcode">
						<img src="/codefend/QR.svg" alt="qrcode-icon" />
					</div>
					<div className="details space">
						<h2>Bitcoin</h2>
						<span>Price in USD: $1,500</span>
						<span>Price in BTC: 0.03863912</span>
						<div className="address-container show-border">
							<span className="codefend-color">Address: </span>
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

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<SecondaryButton
						text="back"
						click={(e: any) => props.goBack?.()}
						className=" codefend_secondary_ac full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="transaction done, finish"
						click={() => props.closeModal()}
						className=" codefend_main_ac full"
					/>
				</div>
			</div>
		</>
	);
};

export default CryptoPayment;
