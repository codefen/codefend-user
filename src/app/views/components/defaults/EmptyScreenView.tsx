import { type FC, type FormEvent } from 'react';
import { GlobeWebIcon, PrimaryButton, Show } from '..';
import { useAddMobileResource } from '@resourcesHooks/mobile/useAddMobileResource';
import { useAddCloud } from '@resourcesHooks/cloud/useAddCloud';
import { useAddLan } from '@resourcesHooks/netowrk/useAddLan';
import { useAddSourceCode } from '@resourcesHooks/sourcecode/useAddSourceCode';
import { useAddSocial } from '@panelHooks/index';
import { ModalInput } from './ModalInput';
import { ModalTextArea } from './ModalTextArea';

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

							<ModalTextArea
								setValue={(val: string) => setDescription(val)}
								placeholder="short description"
								maxLength={600}
							/>
						</Show>
						<Show when={type === 'network'}>
							<ModalInput
								setValue={(val: string) =>
									setNetworkData((prevData: any) => ({
										...prevData,
										externalAddress: val,
									}))
								}
								placeholder="External IP Address"
								required
							/>
							<ModalInput
								setValue={(val: string) =>
									setNetworkData((prevData: any) => ({
										...prevData,
										internalAddress: val,
									}))
								}
								placeholder="Internal IP Address"
								required
							/>

							<ModalTextArea
								setValue={(val: string) =>
									setNetworkData((prevData: any) => ({
										...prevData,
										desc: val,
									}))
								}
								placeholder="short description"
								maxLength={512}
								required
							/>
						</Show>
						<Show when={type === 'source'}>
							<ModalInput
								setValue={(val: string) =>
									setSourceCode((current: any) => ({
										...current,
										repositoryName: val,
									}))
								}
								placeholder="repository name"
								required
							/>
							<ModalInput
								setValue={(val: string) =>
									setSourceCode((current: any) => ({
										...current,
										repositoryUrl: val,
									}))
								}
								placeholder="repository url"
								required
							/>
							<ModalInput
								setValue={(val: string) =>
									setSourceCode((current: any) => ({
										...current,
										sourceCode: val,
									}))
								}
								placeholder="source code language"
								required
							/>

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
							<ModalInput
								setValue={(val: string) =>
									setSocialData((prevData) => ({
										...prevData,
										fName: val,
									}))
								}
								placeholder="name"
							/>

							<ModalInput
								setValue={(val: string) =>
									setSocialData((prevData) => ({
										...prevData,
										lName: val,
									}))
								}
								placeholder="last name"
							/>

							<ModalInput
								setValue={(val: string) =>
									setSocialData((prevData) => ({
										...prevData,
										mail: val,
									}))
								}
								placeholder="email address"
							/>

							<ModalInput
								setValue={(val: string) =>
									setSocialData((prevData) => ({
										...prevData,
										phone: val,
									}))
								}
								placeholder="phone number"
							/>

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
