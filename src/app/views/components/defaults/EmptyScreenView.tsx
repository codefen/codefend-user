import { type FC, type FormEvent } from 'react';
import { GlobeWebIcon, PencilIcon, PrimaryButton, Show } from '..';
import { useAddMobileResource } from '@resourcesHooks/mobile/useAddMobileResource';
import { useAddCloud } from '@resourcesHooks/cloud/useAddCloud';
import { useAddLan } from '@resourcesHooks/netowrk/useAddLan';
import { useAddSourceCode } from '@resourcesHooks/sourcecode/useAddSourceCode';
import { useAddSocial } from '@panelHooks/index';
import { ModalInput } from './ModalInput';

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

	const [sourceCodeForm, { isAddingSource, addSourceCode, setSourceCode }] =
		useAddSourceCode();

	const {
		handleAddSocialResource,
		validations: socialValidations,
		role,
		isAddingMember,
		setSocialData,
	} = useAddSocial(event, () => {});

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
		} else if (type === 'network') {
			handleAddNetwork();
		} else if (type === 'source') {
			addSourceCode().then(() => event());
		} else if (type == 'social') {
			if (socialValidations()) return;
			handleAddSocialResource();
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
							<ModalInput
								setValue={(val: string) => setAndroidAddress(val)}
								placeholder="android download link"
							/>
							<ModalInput
								setValue={(val: string) => setIosAddress(val)}
								placeholder="ios download link"
							/>
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
							<ModalInput
								setValue={(val: string) => setAppName(val)}
								placeholder="name"
								required
							/>

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
						<Show when={type === 'source'}>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) =>
										setSourceCode((current: any) => ({
											...current,
											repositoryName: e.target.value,
										}))
									}
									placeholder="repository name"
									required
								/>
							</div>

							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) =>
										setSourceCode((current: any) => ({
											...current,
											repositoryUrl: e.target.value,
										}))
									}
									placeholder="repository url"
									required
								/>
							</div>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>
								<input
									type="text"
									onChange={(e) =>
										setSourceCode((current: any) => ({
											...current,
											sourceCode: e.target.value,
										}))
									}
									placeholder="source code language"
									required
								/>
							</div>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<select
									onChange={(e) =>
										setSourceCode((current: any) => ({
											...current,
											visibility: e.target.value,
										}))
									}
									className="log-inputs modal_info"
									value={sourceCodeForm.visibility}
									required>
									<option value="" disabled hidden>
										visibility
									</option>
									<option value="public">public</option>
									<option value="private">private</option>
								</select>
							</div>
						</Show>
						<Show when={type === 'social'}>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) =>
										setSocialData((prevData) => ({
											...prevData,
											fName: e.target.value,
										}))
									}
									placeholder="name"
								/>
							</div>

							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) =>
										setSocialData((prevData) => ({
											...prevData,
											lName: e.target.value,
										}))
									}
									placeholder="last name"
								/>
							</div>

							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) =>
										setSocialData((prevData) => ({
											...prevData,
											mail: e.target.value,
										}))
									}
									placeholder="email address"
								/>
							</div>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>

								<input
									type="text"
									onChange={(e) =>
										setSocialData((prevData) => ({
											...prevData,
											phone: e.target.value,
										}))
									}
									placeholder="phone number"
								/>
							</div>
							<div className="form-input">
								<span className="icon">
									<GlobeWebIcon />
								</span>
								<select
									onChange={(e) =>
										setSocialData((prevData) => ({
											...prevData,
											role: e.target.value,
										}))
									}
									id="social-data"
									className="log-inputs modal_info"
									value={role}
									required>
									<option value="" disabled hidden>
										role
									</option>
									<option value="admin">administrative</option>
									<option value="human">human resources</option>
									<option value="info">information tech</option>
									<option value="ads">marketing</option>
									<option value="sales">sales</option>
									<option value="finance">finance</option>
									<option value="cs">customer service</option>
									<option value="prod">production & ops</option>
									<option value="plan">strategy & planning</option>
									<option value="law">legal affairs</option>
								</select>
							</div>
						</Show>
						<div className="button">
							<PrimaryButton
								buttonStyle="red"
								type="submit"
								text={buttonText ?? ''}
								isDisabled={
									isAddingMobile ||
									isAddingCloud ||
									isAddingNetwork ||
									isAddingSource ||
									isAddingMember
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
