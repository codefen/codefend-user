import { useState, type FC } from 'react';
import { HelperBox } from '../helper-box/HelperBox.tsx';
import { Position, type HelperBoxCords } from '@interfaces/helperbox.ts';
import Show from '@defaults/Show.tsx';

import {
	AdminCompanyIcon,
	BugIcon,
	CLoudIcon,
	ChartIcon,
	EnpIcon,
	GlobeWebIcon,
	MobileIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
	LanIcon,
	MessageIcon,
	PreferenceIcon,
} from '@icons';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import './welcome.scss';

enum WelcomeSteps {
	ADMIN,
	DASHBOARD,
	WEB,
	MOBILE,
	CLOUD,
	NET,
	SOURCE,
	SOCIAL,
	EPM,
	ISSUES,
	LAN,
	INX,
	VDB,
	RESONANCE,
	PROVIDER,
	RESELLER,
	SUPPORT,
	PREFERENCES,
	NOTHING,
}

const getButtonCoordinates = (buttonId: string): HelperBoxCords => {
	const buttonElement = document.getElementById(buttonId);

	if (buttonElement) {
		const buttonRect = buttonElement.getBoundingClientRect();
		const buttonWidth = buttonRect.width;
		const buttonHeight = buttonRect.height;
		//   const top = buttonRect.top + window.scrollY + buttonHeight / 2;
		const top = buttonRect.top;
		const left = buttonRect.left + window.scrollX + buttonWidth + 14;

		return { top, left };
	}
	return {};
};

export interface WelcomeGuideProps {
	defaultOpenValue: boolean;
	closeGuide: () => void;
}

const defineInitialTour = (role: string) => {
	if (role === 'admin') {
		return WelcomeSteps.ADMIN;
	} else if (role == 'provider') {
		return WelcomeSteps.NOTHING;
	} else if (role === 'reseller') {
		return WelcomeSteps.NOTHING;
	}
	return WelcomeSteps.DASHBOARD;
};

export const WelcomeGuide: FC<WelcomeGuideProps> = ({
	defaultOpenValue,
	closeGuide,
}) => {
	const { isAdmin, isProvider, isNormalUser, getRole } = useUserRole();
	const [currentStep, setNextStep] = useState(defineInitialTour(getRole()));
	if (defaultOpenValue && currentStep === WelcomeSteps.NOTHING) {
		closeGuide();
	}
	if (!defaultOpenValue) {
		return null;
	}
	return (
		<div className="guide-container">
			<Show when={currentStep === WelcomeSteps.ADMIN && isAdmin()}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.DASHBOARD)}
					coords={getButtonCoordinates('sidebar_company')}
					arrow={{ position: Position.LEFT, coordY: '7%' }}
					icon={<AdminCompanyIcon />}
					text="Any description for admin Any description for admin Any description for admin Any description for adminAny description for admin Any description for admin"
					title="Any title for admin"
					highlight="Any highlight text for admin"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.DASHBOARD &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.WEB)}
					coords={getButtonCoordinates('sidebar_dashboard')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<ChartIcon />}
					text="In the dashboard you can find information about the most critical issues detected in your scope, and relevant details  about your team and resources."
					title="dashboard"
					highlight="Have a brief of your security posture!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.WEB && (isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.MOBILE)}
					coords={getButtonCoordinates('sidebar_web')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<GlobeWebIcon />}
					text="From this section you can control all your web applications, add and remove domains and subdomains to your scope."
					title="web resources"
					highlight="Add your web applications and start a pentest!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.MOBILE &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.NET)}
					coords={getButtonCoordinates('sidebar_mobile')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<MobileIcon />}
					text="From this section you can control all your mobile applications, and those employeed by your team, add any application that you would like to audit."
					title="mobile resources"
					highlight="Add your mobile applications and start a pentest!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.NET && (isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.CLOUD)}
					coords={getButtonCoordinates('sidebar_net')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<LanIcon />}
					text="From this section you can control all your network infrastructure, add network devices and IP addresses and unveil the security of these assets!"
					title="network resources"
					highlight="Define and pentest your network infrastructure"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.CLOUD &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.SOURCE)}
					coords={getButtonCoordinates('sidebar_cloud')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<CLoudIcon />}
					text="From this section you can control all your cloud infrastructure, add your cloud details and allow our experts to secure your infrastructure!"
					title="cloud resources"
					highlight="Add your cloud infrastructure and start a pentest!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.SOURCE &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.SOCIAL)}
					coords={getButtonCoordinates('sidebar_source')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<SourceCodeIcon />}
					text="From this section you can control all your source code, add and remove code repositories to your scope, and request a manual analysis."
					title="source code review"
					highlight="Add your source code and start a review!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.SOCIAL &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.ISSUES)}
					coords={getButtonCoordinates('sidebar_social')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<PeopleGroupIcon />}
					text="From this section you can control all your social media urls and request a manual analysis."
					title="social resources"
					highlight="Add your social accounts and start a review!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.ISSUES &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.SUPPORT)}
					coords={getButtonCoordinates('sidebar_issues')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<BugIcon />}
					text="From this section you can visualize all the reported security issues and obtain customer support in order to solve them."
					title="issues"
					highlight="See the vulnerabilities and detected issues"
				/>
			</Show>

			{/* <Show when={currentStep === WelcomeSteps.EPM}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SUPPORT)}
						coords={getButtonCoordinates('sidebar_epm')}
						arrow={{ position: Position.LEFT, coordY: '5%' }}
						icon={<EnpIcon />}
						text="Scan you computers to track issues on your installed aplications"
						title="Endpoint monitoring"
						highlight="Know what you installed"
					/>
				</Show> */}

			<Show
				when={
					currentStep === WelcomeSteps.SUPPORT &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={() => setNextStep(WelcomeSteps.PREFERENCES)}
					coords={getButtonCoordinates('sidebar_support')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<MessageIcon />}
					text="You can contact codefend’s customer support with any kind of security related matters that you have while your subscription is active!"
					title="codefend contact support"
					highlight="Contact us at any time!"
				/>
			</Show>

			<Show
				when={
					currentStep === WelcomeSteps.PREFERENCES &&
					(isAdmin() || isNormalUser())
				}>
				<HelperBox
					close={closeGuide}
					next={closeGuide}
					coords={getButtonCoordinates('sidebar_preferences')}
					arrow={{ position: Position.LEFT, coordY: '5%' }}
					icon={<PreferenceIcon />}
					text="From this section you can update your user details, update security measures, administrate team members and see your invoices and orders."
					title="preferences"
					highlight="Administrate preferences, team and your invoices!"
					isFinishStep
				/>
			</Show>
		</div>
	);
};
