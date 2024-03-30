import { type FC, useEffect, useRef, useState } from 'react';
import {
	OrderSection,
	useOrderProvider,
	useOrderStore,
} from '../../../../../data';
import { PageLoader, PrimaryButton, Show } from '../../..';

interface Provider {
	id: string;
	username: string;
	name: string;
	profileMedia: string;
}

export const LeadOrderModal: FC = () => {
	const { providerId, updateState, resetActiveOrder, referenceNumber } =
		useOrderStore((state) => state);
	const { sendOrderProvider, getCurrentProviders } = useOrderProvider();

	const [providerIdW, setProviderId] = useState<string>(providerId);
	const providers = useRef<Provider[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (isLoading) {
			getCurrentProviders(referenceNumber)
				.then((res: any) => {
					providers.current = res.provider_users
						? res.provider_users.map(
								(provider: any) =>
									({
										id: provider.id,
										username: provider.username,
										profileMedia: provider.profile_media,
										name: `${provider.fname} ${provider.lname}`,
									}) as Provider,
							)
						: [];
					setProviderId(
						res.provider_users ? res.provider_users[0].id : '',
					);
				})
				.finally(() => setIsLoading(false));
		}
	}, []);

	const nextStep = () => {
		sendOrderProvider(referenceNumber, providerIdW);
		updateState('providerId', providerIdW);
		updateState('orderStepActive', OrderSection.ENVIRONMENT);
	};

	const backStep = () =>
		updateState('orderStepActive', OrderSection.ORDER_REVIEW);

	const ProviderLoader = () => (
		<div>
			<h2 className="order-plan-loader-title">
				Retrieving current system providers
			</h2>
			<PageLoader />
		</div>
	);

	const ProviderEmptyFallback = () => (
		<div className="option-header">
			<h2>Oops sorry, we have no suppliers available at this time</h2>
		</div>
	);

	return (
		<>
			<Show when={isLoading}>
				<ProviderLoader />
			</Show>
			<Show when={!isLoading && !Boolean(providers.current.length)}>
				<ProviderEmptyFallback />
			</Show>

			<Show when={Boolean(providers.current.length) && !isLoading}>
				<>
					<div className="step-header">
						<h3>
							<b>
								Please select your desired team to conduct this order:
							</b>
						</h3>
					</div>
					<div className="step-content more-results">
						{providers.current.map((provider) => (
							<div
								key={`prov-${provider.id}`}
								className={`option block-xll order-pointer ${
									providerIdW === provider.id && `select-option`
								}`}
								onClick={() => setProviderId(provider.id)}>
								<img
									className="hackers-profile-media"
									src={`data:image/png;base64, ${provider.profileMedia}`}
									alt="header-icon"
								/>
								<div className="order-snapshot">
									<div className="top">
										<p>
											{provider.name} |{' '}
											<span className="codefend-text-red">
												@{provider.username}
											</span>
										</p>
									</div>
									<span className="one-pentest">
										An internal selection of professional/s that best
										fit your needs.
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
						click={resetActiveOrder}
						className="full"
						buttonStyle="black"
						disabledLoader
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue"
						click={nextStep}
						className="full"
						buttonStyle="red"
					/>
				</div>
			</div>
		</>
	);
};
