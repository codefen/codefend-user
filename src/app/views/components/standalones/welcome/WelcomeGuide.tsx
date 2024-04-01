import { useState, type FC, useEffect } from 'react';
import { HelperBox } from '..';
import './welcome.scss';
import { Position, useUserAdmin } from '../../../../data';
import {
	Show,
	AdminCompany,
	BugIcon,
	CLoudIcon,
	ChartIcon,
	EnpIcon,
	GlobeWebIcon,
	MobileIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
} from '../..';

enum WelcomeSteps {
	ADMIN,
	DASHBOARD,
	WEB,
	MOBILE,
	CLOUD,
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
}

export interface WelcomeGuideProps {
	defaultOpenValue: boolean;
	closeGuide: () => void;
}

export const WelcomeGuide: FC<WelcomeGuideProps> = ({
	defaultOpenValue,
	closeGuide,
}) => {
	const { isAdmin } = useUserAdmin();
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
						icon={<AdminCompany />}
						text="Any description for admin"
						title="Any title for admin"
						highlight="Any highlight text for admin"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.DASHBOARD}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.WEB)}
						coords={{ top: '6rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<ChartIcon />}
						text="Any description for dashboard"
						title="Any title for dashboard"
						highlight="Any highlight text for dashboard"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.WEB}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.MOBILE)}
						coords={{ top: '9.25rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<GlobeWebIcon />}
						text="Any description for web"
						title="Any title for web"
						highlight="Any highlight text for web"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.MOBILE}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.CLOUD)}
						coords={{ top: '12.25rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<MobileIcon />}
						text="Any description for mobile"
						title="Any title for mobile"
						highlight="Any highlight for mobile"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.CLOUD}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SOURCE)}
						coords={{ top: '15.75rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<CLoudIcon />}
						text="Any description for cloud"
						title="Any title for cloud"
						highlight="Any highlight for cloud"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.SOURCE}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.SOCIAL)}
						coords={{ top: '18.9rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<SourceCodeIcon />}
						text="Any description for source"
						title="Any title for source"
						highlight="Any highlight for source"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.SOCIAL}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.ENP)}
						coords={{ top: '22.05rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<PeopleGroupIcon />}
						text="Any description for social"
						title="Any title for social"
						highlight="Any highlight for social"
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.ENP}>
					<HelperBox
						close={closeGuide}
						next={() => setNextStep(WelcomeSteps.ISSUES)}
						coords={{ top: '25.28rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<EnpIcon />}
						text="Any description for enp"
						title="Any title for enp"
						highlight="Any highlight for enp"
						isFinishStep
					/>
				</Show>

				<Show when={currentStep === WelcomeSteps.ISSUES}>
					<HelperBox
						close={closeGuide}
						next={closeGuide}
						coords={{ top: '28.57rem', left: '6rem' }}
						arrow={{ position: Position.LEFT, coordY: '35%' }}
						icon={<BugIcon />}
						text="Any description for issues"
						title="Any title for issues"
						highlight="Any highlight for issues"
						isFinishStep
					/>
				</Show>
			</div>
		</Show>
	);
};
