import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useOrderStore } from '@stores/orders.store.ts';
import { RememberCard } from '../components/remember/RememberCard.tsx';
import { OrderAlertMessage } from '../components/OrderAlertMessage.tsx';

export const WaitingCheckOrderModal = () => {
	const { resetActiveOrder } = useOrderStore((state) => state);

	return (
		<>
			<OrderAlertMessage
				imageIcon={<img src="/util/hourglass.png" alt="Codefend logo" />}
				title="Await for confirmation">
				<p>
					<span className="bolder block">
						The chosen payment method requires confirmation.
					</span>
					Please allow our team a maximum of 24 hours to verify your
					payment.
					<span className="codefend-text-red underline-high">
						You will receive an email once the payment is confirmed and
						your team will start immediately.
					</span>
				</p>
			</OrderAlertMessage>
			<RememberCard>
				bank and cryptocurrency payments are also efficient payment methods!
			</RememberCard>

			<div className="button-wrapper next-btns">
				<div className="secondary-container">
					<PrimaryButton
						text="cancel"
						click={() => {}}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="returns to app"
						click={() => resetActiveOrder()}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
