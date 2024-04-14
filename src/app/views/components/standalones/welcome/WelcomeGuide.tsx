import { useState, type FC } from 'react';
import { HelperBox } from '../helper-box/HelperBox.tsx';
import { Position } from '@interfaces/helperbox.ts';
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
	ENP,
	ISSUES,
	LAN,
	INX,
	VDB,
	RESONANCE,
	HACKER,
	RESELLER,
	SUPPORT,
	PREFERENCES,
}

export interface WelcomeGuideProps {
	defaultOpenValue: boolean;
	closeGuide: () => void;
}


  

export const WelcomeGuide: FC<WelcomeGuideProps> = ({
	defaultOpenValue,
	closeGuide,
}) => {
	const { isAdmin } = useUserRole();
	const [currentStep, setNextStep] = useState(
		!isAdmin() ? WelcomeSteps.DASHBOARD : WelcomeSteps.ADMIN,
	);
	
	return (
		<Show when={defaultOpenValue}>
			<div className="guide-container">
				<Show when={currentStep === WelcomeSteps.ADMIN && isAdmin()}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.DASHBOARD)}
						coords={{ top: '4rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '22%' }}
						icon={<AdminCompanyIcon />}
						text="Any description for admin"
						title="Any title for admin"
						highlight="Any highlight text for admin"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.DASHBOARD}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.WEB)}
						coords={{ top: '4rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<ChartIcon />}
						text="In the dashboard you can find information about the most critical issues detected in your scope, and relevant details  about your team and resources."
						title="dashboard"
						highlight="Have a brief of your security posture!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.WEB}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.MOBILE)}
						coords={{ top: '9.25rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<GlobeWebIcon />}
						text="From this section you can control all your web applications, add and remove domains and subdomains to your scope."
						title="scope: web resources"
						highlight="Add your web applications and start a pentest!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.MOBILE}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.CLOUD)}
						coords={{ top: '12.25rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<MobileIcon />}
						text="From this section you can control all your mobile applications, and those employeed by your team, add any application that you would like to audit."
						title="scope: mobile resources"
						highlight="Add your mobile applications and start a pentest!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.CLOUD}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SOURCE)}
						coords={{ top: '15.75rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<CLoudIcon />}
						text="From this section you can control all your cloud infrastructure, add your cloud details and allow our experts to secure your infrastructure!"
						title="scope: cloud resources"
						highlight="Add your cloud infrastructure and start a pentest!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.NET}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SOURCE)}
						coords={{ top: '18.9rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<SourceCodeIcon />}
						text="From this section you can control all your network infrastructure, add network devices and IP addresses and unveil the security of these assets!"
						title="scope: network resources"
						highlight="Define and pentest your network infrastructure"
					/>
				</Show>
				
				<Show when={currentStep === WelcomeSteps.SOURCE}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SOCIAL)}
						coords={{ top: '18.9rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<SourceCodeIcon />}
						text="From this section you can control all your source code, add and remove code repositories to your scope, and request a manual analysis."
						title="scope: source code review"
						highlight="Add your source code and start a review!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.SOCIAL}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.ISSUES)}
						coords={{ top: '22.05rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<PeopleGroupIcon />}
						text="From this section you can control all your social media urls and request a manual analysis."
						title="scope: social resources"
						highlight="Add your social accounts and start a review!"
					/>
				</Show>



				<Show when={currentStep === WelcomeSteps.ISSUES}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.ENP)}
						coords={{ top: '28.57rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<BugIcon />}
						text="Onces you request a pentest, the hacker will report all the issues here in a list, you can click on them to see more info."
						title="issues"
						highlight="See issues at real time!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.ENP}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SUPPORT)}
						coords={{ top: '25.28rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<EnpIcon />}
						text="Scan you computers to track issues on your installed aplications"
						title="Endpoint monitoring"
						highlight="Know what you installed"
					/>
				</Show>


				<Show when={currentStep === WelcomeSteps.SUPPORT}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.PREFERENCES)}
						coords={{ top: '28.57rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<BugIcon />}
						text="You can contact codefend’s customer support with any kind of security related matters that you have while your subscription is active!"
						title="codefend contact support"
						highlight="Contact us at any time!"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.PREFERENCES}>
					<HelperBox
						close={closeGuide}
						next={closeGuide}
						coords={{ top: '28.57rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<BugIcon />}
						text="From this section you can update your user details, update security measures, administrate team members and see your invoices and orders."
						title="preferences"
						highlight="Administrate preferences, team and your invoices!"
						isFinishStep
					/>
				</Show>
			</div>
		</Show>
	);
};
