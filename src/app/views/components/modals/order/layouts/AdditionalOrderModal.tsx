import { type FC, useCallback, useState } from 'react';
import { PrimaryButton } from '../../..';
import {
	OrderSection,
	useOrderStore,
	userOrderProviderInfo,
} from '../../../../../data';

export const AdditionalOrderModal: FC = () => {
	const [aditionalInfoW, setAditionalInfo] = useState('');
	const { updateState, referenceNumber, orderId } = useOrderStore(
		(state) => state,
	);
	const { sendOrderProviderInfo } = userOrderProviderInfo();

	const placeHolderText = `What is the main reason to conduct this excersive?

Is there any particular resource that requires additional attention?

What's the main concern about security?

Is there any other additional information for our professionals?`;

	const change = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAditionalInfo(e.target.value);
	}, []);
	const continueToPayment = () => {
		updateState('aditionalInfo', aditionalInfoW);
		sendOrderProviderInfo(referenceNumber, aditionalInfoW, orderId);
		updateState('orderStepActive', OrderSection.PAYMENT);
	};

	return (
		<>
			<div className="step-header">
				<h3>
					<b>
						At this point you can provide any additional information for
						the professional
					</b>
				</h3>
			</div>
			<div className="step-content space">
				<textarea
					name="aditionalInfoW"
					id="aditional-info-order"
					value={aditionalInfoW}
					onChange={change}
					placeholder={placeHolderText}
					cols={82}
					rows={11}></textarea>
			</div>
			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<PrimaryButton
						text="back"
						click={() =>
							updateState('orderStepActive', OrderSection.ENVIRONMENT)
						}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Proceed to payment"
						click={continueToPayment}
						className="full"
						buttonStyle="red"
						disabledLoader
					/>
				</div>
			</div>
		</>
	);
};
