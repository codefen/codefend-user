import { type FC, type FormEvent } from 'react';
import { GlobeWebIcon, PencilIcon, PrimaryButton, Show } from '..';
import AddMobileModal from '@modals/adding-modals/AddMobileModal';
import { useAddMobileResource } from '@resourcesHooks/mobile/useAddMobileResource';
import { useAddCloud } from '@resourcesHooks/cloud/useAddCloud';
import { useAddLan } from '@resourcesHooks/netowrk/useAddLan';

interface EmptyScreenProps {
	title?: string;
	info?: string;
	buttonText?: string;
	type?: string;
	event: () => void;
}

const EmptyScreenView: FC<EmptyScreenProps> = ({
	title,
	info,
	buttonText,
	event,
	type,
}) => {
	const {
		handleAddMobileResource,
		setAndroidAddress,
		setIosAddress,
		isAddingMobile,
	} = useAddMobileResource();

	const {
		provider,
		refetch: handleAddCloud,
		isAddingCloud,
		setAppName,
		setProvider,
		setDescription,
		validations,
	} = useAddCloud(() => {}, event);

	const {
		internalAddress,
		externalAddress,
		isLoading: isAddingNetwork,
		refetch: handleAddNetwork,
		setNetworkData,
	} = useAddLan(event, () => {});

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setNetworkData((prevData: any) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (type === 'mobile') {
			handleAddMobileResource(event, () => {});
		} else if (type === 'cloud') {
			if (validations()) return;
			handleAddCloud();
		} else if (type == 'network') {
			handleAddNetwork();
		}
	};
	return (
		<div className="empty-screen empty-card">
			<div className="empty-container">
				<div className="empty-card-wrapper">
					<div className="header">
						<span className="first-text">{title}</span>
						<span className="second-text">{info}</span>
					</div>
					<form className="form" onSubmit={handleSubmit}>
						<Show when={type === 'mobile'}>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) => {
										setAndroidAddress(e.target.value);
									}}
									placeholder="android download link"
								/>
							</div>

							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) => {
										setIosAddress(e.target.value);
									}}
									placeholder="ios download link"
								/>
							</div>
						</Show>
						<Show when={type === 'cloud'}>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<select
									onChange={(e) => setProvider(e.target.value)}
									className="log-inputs modal_info"
									id="select-provider-cloud"
									value={provider}
									required>
									<option value="" disabled hidden>
										Provider
									</option>
									<option value="azure">Azure</option>
									<option value="aws">AWS</option>
									<option value="google">Google</option>
								</select>
							</div>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) => setAppName(e.target.value)}
									placeholder="name"
									required
								/>
							</div>

							<div className="form-input">
								<span className="pencil-icon need-m">
									<PencilIcon />
								</span>
								<textarea
									onChange={(e) => setDescription(e.target.value)}
									name="desc"
									placeholder="short description"
									className="text-area-input log-inputs2 text-area "
									maxLength={600}></textarea>
							</div>
						</Show>
						<Show when={type === 'network'}>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									name="externalAddress"
									value={externalAddress}
									onChange={handleChange}
									placeholder="External IP Address"
									required
								/>
							</div>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									name="internalAddress"
									value={internalAddress}
									onChange={handleChange}
									placeholder="Internal IP Address"
									required
								/>
							</div>

							<div className="form-input">
								<span className="pencil-icon need-m">
									<PencilIcon />
								</span>
								<textarea
									onChange={handleChange}
									name="desc"
									placeholder="short description"
									className="text-area-input log-inputs2 text-area "
									maxLength={512}
									required></textarea>
							</div>
						</Show>
						<div className="button">
							<PrimaryButton
								buttonStyle="red"
								type="submit"
								text={buttonText ?? ''}
								isDisabled={
									isAddingMobile || isAddingCloud || isAddingNetwork
								}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EmptyScreenView;
