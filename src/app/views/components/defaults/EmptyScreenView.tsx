import { PureComponent, type FC, type ReactNode } from 'react';
import { PrimaryButton, Show } from '..';
import { NetworkDadForm } from '@/app/views/components/forms/NetworkDadForm';
import MobileResourceForm from '@/app/views/components/forms/MobileResourceForm';
import { CloudResourceForm } from '@/app/views/components/forms/CloudResourceForm';
import SocialResourceForm from '@/app/views/components/forms/SocialResourceForm';
import { SourceResourceForm } from '@/app/views/components/forms/SourceResourceForm';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import WebDomainForm from '../forms/WebDomainForm';
import { 
	GlobeWebIcon,
	CLoudIcon,
	MobileIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
	LanIcon,
} from '@icons';

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
						<Show when={type === RESOURCE_CLASS.WEB}>
							<div className="header">
								<div className='image'>
									<GlobeWebIcon />
								</div>
								<div className='text'>
									<div className="title">Add a new web resource</div>
									<p>
										From this section you can add a new web resource like websites and web applications.
										<br/> <br/> 
                                        <span className="codefend-text-red">
                                            Launch a pentest: 
                                        </span>
										&nbsp;Once you have loaded the desired resources you can request a web application penetration test to check their security.
                                    </p>
									
								</div>
							</div>
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
							<div className="header">
								<div className='image'>
									<LanIcon />
								</div>
								<div className='text'>
									<span className="title">{title}</span>
									<p>{info}</p>
								</div>
							</div>
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
							<div className="header">
								<div className='image'>
									<MobileIcon />
								</div>
								<div className='text'>
									<span className="title">{title}</span>
									<p>{info}</p>
								</div>
							</div>							
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
							<div className="header">
								<div className='image'>
									<CLoudIcon />
								</div>
								<div className='text'>
									<span className="title">{title}</span>
									<p>{info}</p>
								</div>
							</div>
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
							<div className="header">
								<div className='image'>
									<PeopleGroupIcon />
								</div>
								<div className='text'>
									<span className="title">{title}</span>
									<p>{info}</p>
								</div>
							</div>							
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
							<div className="header">
								<div className='image'>
									<SourceCodeIcon />
								</div>
								<div className='text'>
									<span className="title">{title}</span>
									<p>{info}</p>
								</div>
							</div>									
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
