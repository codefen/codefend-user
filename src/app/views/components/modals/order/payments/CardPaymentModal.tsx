import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	OrderSection,
	useOrderStore,
	userOrderCardPayment,
} from '../../../../../data';
import { loadStripe } from '@stripe/stripe-js';
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { ModalButtons } from '@standalones/utils/ModalButtons';

//pk_live_51OJhuSAYz1YvxmilzJk2qtYgC6lrwwjziEOc69rTgUI0guBwWsAlnHOViPvLlf6myPtxFrsr0l1JfmdTjDjV9iRt00zJeEpd45
const stripePromise = loadStripe(
	'pk_test_51OJhuSAYz1YvxmilHmPHF8hzpPAEICOaObvc6jogRaqY79MSgigrWUPPpXcnWOCMh4hs4ElO3niT7m1loeSgN0oa00vVlSF8Ad',
);

export const CardPaymentModal = () => {
	const [fetcher] = useFetcher();
	const { getCompany } = useUserData();
	const { updateState, referenceNumber, orderId } = useOrderStore(
		(state) => state,
	);
	//const [cardInfo, { setCardInfo, sendPayment, isLoading }] =
	//	userOrderCardPayment();

	const fetchClientSecret = useCallback(() => {
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'financial_card_co',
				company_id: getCompany(),
				reference_number: referenceNumber,
				order_id: orderId,
			},
		}).then(({ data }: any) => data.clientSecret);
	}, []);

	const backStep = () => {
		updateState('orderStepActive', OrderSection.PAYMENT);
	};

	const options = useMemo(() => {
		return {
			fetchClientSecret,
			onComplete: () => {
				fetcher('post', {
					body: {
						model: 'orders/add',
						phase: 'financial_card_s',
						company_id: getCompany(),
						reference_number: referenceNumber,
						order_id: orderId,
					},
				});
			},
		};
	}, []);

	return (
		<>
			<div className="step-header">
				<h3>
					<b>Please enter your payment information</b>
				</h3>
			</div>
			<EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
				<EmbeddedCheckout
					className="stripe-container"
					id="stripe-ex-contentr"
				/>
			</EmbeddedCheckoutProvider>
			<ModalButtons
				close={backStep}
				closeText="Back"
				confirmText="Payment"
				isDisabled={false}
				boxStyle="button-wrapper next-btns"
			/>
		</>
	);
};
