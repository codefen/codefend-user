import { type FC, useEffect, useRef, useState } from 'react';
import {
	OrderSection,
	useOrderProvider,
	useOrderStore,
} from '../../../../../data';
import { PageLoader, PrimaryButton, SecondaryButton, Show } from '../../..';

interface Provider {
	id: string;
	username: string;
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
					providers.current = res.providers
						? res.providers.map(
								(provider: any) =>
									({
										id: provider.id,
										username: provider.username,
										profileMedia: provider.profile_media,
									}) as Provider,
							)
						: [];
					setProviderId(res.providers ? res.providers[0].id : '');
				})
				.finally(() => setIsLoading(false));
		}
	}, []);

	const nextStep = () => {
		sendOrderProvider(referenceNumber, providerIdW);
		updateState('providerId', providerIdW);
		updateState('orderStepActive', OrderSection.ENVIRONMENT);
	};

	const ProviderLoader = () => (
		<div>
			<h2 className="order-plan-loader-title">
				Retrieving current system providers
			</h2>
			<PageLoader />
		</div>
	);

	const ProviderEmptyFallback = () => (
		<div>
			<h2>Oops sorry, we have no suppliers available at this time</h2>
		</div>
	);

	return (
		<>
			<Show when={!isLoading} fallback={<ProviderLoader />}>
				<div className="option-header">
					<h3>
						<b>Please select your desired team to conduct this order:</b>
					</h3>
				</div>
			</Show>

			{!Boolean(providers.current.length) && !isLoading ? (
				<ProviderEmptyFallback />
			) : (
				<div className="scope-content show-both-borders more-results">
					{providers.current.map((provider) => (
						<div
							key={`prov-${provider.id}`}
							className={`option block-xll show-both-borders order-pointer ${
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
										Codefend private team |{' '}
										<span className="codefend-text-red"> lead: </span>
										@{provider.username}
									</p>
								</div>
								<span className="one-pentest">
									An internal selection of professional/s that best fit
									your needs.
								</span>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="button-wrapper next-btns">
				<div className="secondary-container ">
					<SecondaryButton
						text="Cancel"
						click={resetActiveOrder}
						className="full"
					/>
				</div>
				<div className="primary-container">
					<PrimaryButton
						text="Continue"
						click={nextStep}
						className="full"
					/>
				</div>
			</div>
		</>
	);
};
