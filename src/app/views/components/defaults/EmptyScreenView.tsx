import { PureComponent, type FC, type ReactNode } from 'react';
import { PrimaryButton, Show } from '..';
import { NetworkDadForm } from '@/app/views/components/forms/NetworkDadForm';
import MobileResourceForm from '@/app/views/components/forms/MobileResourceForm';
import { CloudResourceForm } from '@/app/views/components/forms/CloudResourceForm';
import SocialResourceForm from '@/app/views/components/forms/SocialResourceForm';
import { SourceResourceForm } from '@/app/views/components/forms/SourceResourceForm';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import WebDomainForm from '../forms/WebDomainForm';

interface EmptyScreenProps {
	title?: string;
	info?: string;
	buttonText?: string;
	type?: string;
	event: () => void;
}

class EmptyScreenButton extends PureComponent<{
	isDisabled: boolean;
	buttonText: string;
}> {
	override render(): ReactNode {
		const { isDisabled, buttonText } = this.props;
		return (
			<div className="button">
				<PrimaryButton
					buttonStyle="red"
					type="submit"
					text={buttonText}
					isDisabled={isDisabled}
				/>
			</div>
		);
	}
}

class EmptyScreenView extends PureComponent<EmptyScreenProps> {
	override render(): ReactNode {
		const { title, info, buttonText = '', event, type } = this.props;
		return (
			<div className="empty-screen empty-card">
				<div className="empty-container">
					<div className="empty-card-wrapper">
						<div className="header">
							<span className="first-text">{title}</span>
							<span className="second-text">{info}</span>
						</div>
						<Show when={type === RESOURCE_CLASS.WEB}>
							<WebDomainForm onDone={event}>
								{(isLoading) => (
									<EmptyScreenButton
										isDisabled={isLoading}
										buttonText={buttonText}
									/>
								)}
							</WebDomainForm>
						</Show>
						<Show when={type === RESOURCE_CLASS.NETWORK}>
							<NetworkDadForm onDone={event}>
								{(isLoading) => (
									<EmptyScreenButton
										isDisabled={isLoading}
										buttonText={buttonText}
									/>
								)}
							</NetworkDadForm>
						</Show>
						<Show when={type === RESOURCE_CLASS.MOBILE}>
							<MobileResourceForm onDone={event}>
								{(isLoading) => (
									<EmptyScreenButton
										isDisabled={isLoading}
										buttonText={buttonText}
									/>
								)}
							</MobileResourceForm>
						</Show>
						<Show when={type === RESOURCE_CLASS.CLOUD}>
							<CloudResourceForm onDone={event}>
								{(isLoading) => (
									<EmptyScreenButton
										isDisabled={isLoading}
										buttonText={buttonText}
									/>
								)}
							</CloudResourceForm>
						</Show>
						<Show when={type === RESOURCE_CLASS.SOCIAL}>
							<SocialResourceForm onDone={event}>
								{(isLoading) => (
									<EmptyScreenButton
										isDisabled={isLoading}
										buttonText={buttonText}
									/>
								)}
							</SocialResourceForm>
						</Show>
						<Show when={type === RESOURCE_CLASS.SOURCE}>
							<SourceResourceForm onDone={event}>
								{(isLoading) => (
									<EmptyScreenButton
										isDisabled={isLoading}
										buttonText={buttonText}
									/>
								)}
							</SourceResourceForm>
						</Show>
					</div>
				</div>
			</div>
		);
	}
}

export default EmptyScreenView;
