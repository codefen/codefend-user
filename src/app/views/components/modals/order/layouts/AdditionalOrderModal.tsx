import React, { TextareaHTMLAttributes, useCallback, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../../..';
import { OrderSection, useOrderStore } from '../../../../../data';

export const AdditionalOrderModal: React.FC<any> = () => {
	const [aditionalInfoW, setAditionalInfo] = useState('');
	const { updateState } = useOrderStore((state) => state);

	const placeHolderText = `What is the main reason to conduct this excersive?

Is there any particular resource that requires additional attention?

What's the main concern about security?

Is there any other additional information for our professionals?`;

	const change = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAditionalInfo(e.target.value);
	}, []);
	const continueToPayment = () => {
		updateState('aditionalInfo', aditionalInfoW);
		updateState('orderStepActive', OrderSection.PAYMENT);
	};

	return (
		<>
			<div className="option-header">
				<h3>
					<b>
						At this point you can provide any additional information for
						the professional
					</b>
				</h3>
			</div>
			<div className="scope-content show-both-borders space">
				<textarea
					name="aditionalInfoW"
					id="aditional-info-order"
					value={aditionalInfoW}
					onChange={change}
					placeholder={placeHolderText}
					cols={70}
					rows={11}></textarea>
			</div>
			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<SecondaryButton
						text="back"
						click={() =>
							updateState('orderStepActive', OrderSection.SELECT_LEAD)
						}
						className="full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Proceed to payment"
						click={continueToPayment}
						className="full"
					/>
				</div>
			</div>
		</>
	);
};
