import { type FC, type FormEvent } from 'react';
import { GlobeWebIcon, PrimaryButton, Show } from '..';
import { useAddSourceCode } from '@resourcesHooks/sourcecode/useAddSourceCode';
import { useAddSocial } from '@panelHooks/index';
import { ModalInput } from './ModalInput';
import { NetworkDadForm } from '@modals/forms/NetworkDadForm';
import MobileResourceForm from '@modals/forms/MobileResourceForm';
import { CloudResourceForm } from '@modals/forms/CloudResourceForm';

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
	const [sourceCodeForm, { isAddingSource, addSourceCode, setSourceCode }] =
		useAddSourceCode();

	const {
		handleAddSocialResource,
		validations: socialValidations,
		role,
		isAddingMember,
		setSocialData,
	} = useAddSocial(event, () => {});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (type === 'source') {
			addSourceCode().then(() => event());
		} else if (type == 'social') {
			if (socialValidations()) return;
			handleAddSocialResource();
		}
	};
	const EmptyScreenButton: FC<{ isDisabled: boolean }> = ({ isDisabled }) => (
		<div className="button">
			<PrimaryButton
				buttonStyle="red"
				type="submit"
				text={buttonText ?? ''}
				isDisabled={isDisabled}
			/>
		</div>
	);
	return (
		<div className="empty-screen empty-card">
			<div className="empty-container">
				<div className="empty-card-wrapper">
					<div className="header">
						<span className="first-text">{title}</span>
						<span className="second-text">{info}</span>
					</div>
					<Show when={type === 'network'}>
						<NetworkDadForm onDone={event}>
							{(isLoading) => (
								<EmptyScreenButton isDisabled={isLoading} />
							)}
						</NetworkDadForm>
					</Show>
					<Show when={type === 'mobile'}>
						<MobileResourceForm onDone={event}>
							{(isLoading) => (
								<EmptyScreenButton isDisabled={isLoading} />
							)}
						</MobileResourceForm>
					</Show>
					<Show when={type === 'cloud'}>
						<CloudResourceForm onDone={event}>
							{(isLoading) => (
								<EmptyScreenButton isDisabled={isLoading} />
							)}
						</CloudResourceForm>
					</Show>
					<Show when={type !== 'network' && type !== 'mobile'}>
						<form className="form" onSubmit={handleSubmit}>
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
							<EmptyScreenButton
								isDisabled={isAddingSource || isAddingMember}
							/>
						</form>
					</Show>
				</div>
			</div>
		</div>
	);
};

export default EmptyScreenView;
