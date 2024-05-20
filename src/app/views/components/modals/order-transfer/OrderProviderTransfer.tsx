import { type FC } from 'react';
import { toast } from 'react-toastify';
import { useFinishForwardOrder } from '@userHooks/providers/useFinishForwardOrder';
import { PROVIDER_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import './ordertransfer.scss';
import Show from '@defaults/Show';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';

interface OrderProviderTransferProps {
	providers: any[];
	orderId: string;
	openModel: boolean;
	close: (openOrder?: boolean) => void;
}

export const OrderProviderTransfer: FC<OrderProviderTransferProps> = ({
	providers,
	openModel,
	orderId,
	close,
}) => {
	const [transferProvider, isLoading, { finishForwardOrder, setTransfer }] =
		useFinishForwardOrder();
	const sendTransfer = () => {
		finishForwardOrder(orderId).then((data) => {
			close(true);
			if (data) {
				toast.success(PROVIDER_PANEL_TEXT.TRANSFER_ORDER);
			}
		});
	};

	const backStep = () => {
		close();
	};

	const ProviderEmptyFallback = () => (
		<div className="option-header">
			<h2>Oops sorry, we have no suppliers available at this time</h2>
		</div>
	);

	return (
		<ModalTitleWrapper
			headerTitle="Choosing a new provider"
			type="modal-transfer"
			isActive={openModel}
			close={close}>
			<Show when={openModel && !Boolean(providers.length)}>
				<ProviderEmptyFallback />
			</Show>

			<Show when={Boolean(providers.length) && openModel}>
				<>
					<div className="step-header">
						<h3>
							<b>
								Select the provider you want to transfer the order to
							</b>
						</h3>
					</div>
					<div className="step-content more-results">
						{providers.map((provider) => (
							<div
								key={`prov-${provider.id}`}
								className={`option block-xll order-pointer ${
									transferProvider === provider.id && `select-option`
								}`}
								onClick={() => setTransfer(provider.id)}>
								<img
									className="hackers-profile-media"
									src={`data:image/png;base64, ${provider.profile_media}`}
									alt="header-icon"
								/>
								<div className="order-snapshot">
									<div>
										<p>
											{`${provider.fname} ${provider.lname}`} |{' '}
											<span className="codefend-text-red">
												@{provider.username}
											</span>
										</p>
									</div>
									<span className="one-pentest">
										{provider.headline}
									</span>
									<span className="one-pentest leading-text">
										<span className="codefend-text-red">Match:</span>{' '}
										specialized in <b>web resources.</b>
									</span>
								</div>
							</div>
						))}
					</div>
				</>
			</Show>

			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<PrimaryButton
						text="Cancel"
						click={backStep}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Transfer order"
						click={sendTransfer}
						className="full"
						buttonStyle="red"
						disabledLoader
						isDisabled={isLoading || transferProvider == ''}
					/>
				</div>
			</div>
		</ModalTitleWrapper>
	);
};
