import { type FC } from 'react';
import { PrimaryButton, Show } from '..';
import { NetworkDadForm } from '@modals/forms/NetworkDadForm';
import MobileResourceForm from '@modals/forms/MobileResourceForm';
import { CloudResourceForm } from '@modals/forms/CloudResourceForm';
import SocialResourceForm from '@modals/forms/SocialResourceForm';
import { SourceResourceForm } from '@modals/forms/SourceResourceForm';

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
					<Show when={type === 'social'}>
						<SocialResourceForm onDone={event}>
							{(isLoading) => (
								<EmptyScreenButton isDisabled={isLoading} />
							)}
						</SocialResourceForm>
					</Show>
					<Show when={type === 'source'}>
						<SourceResourceForm onDone={event}>
							{(isLoading) => (
								<EmptyScreenButton isDisabled={isLoading} />
							)}
						</SourceResourceForm>
					</Show>
				</div>
			</div>
		</div>
	);
};

export default EmptyScreenView;
