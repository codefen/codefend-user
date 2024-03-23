import { PrimaryButton, SecondaryButton } from '../../..';
import { useOrderStore } from '../../../../../data';

export const WelcomeOrderModal = () => {
	const { resetActiveOrder } = useOrderStore((state) => state);

	return (
		<>
			<div className="scope-welcome">
				<div className="codefend-img">
					<img src="/codefend/fav.png" alt="Codefend logo" />
				</div>
				<div className="welcome-container">
					<h3>Welcome</h3>
					<div className="top">
						<p>
							<span className="codefend-text-red underline-high block">
								Your payment has been sucessfully processed!
							</span>
							The selected team has been notified and will start the test
							as soon as possible.{' '}
							<span className="codefend-text-red underline-high">
								A confirmation email has been sent!
							</span>{' '}
							Please feel free to close this window.
						</p>
					</div>
				</div>
			</div>

			<div className="welcome-remember">
				<img src="/codefend/fav.png" alt="Codefend logo" />
				<div className="top">
					<p>
						<span className="codefend-text-red">Remember!</span> you'll be
						always notified by email whenever a new vulnerability or issue
						is reported!
					</p>
				</div>
			</div>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<SecondaryButton
						text=""
						click={() => {}}
						className="full order-default bg-transparent"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="returns to app"
						click={() => resetActiveOrder()}
						className="full"
					/>
				</div>
			</div>
		</>
	);
};
