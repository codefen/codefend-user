import { useEffect, useState, type FC } from 'react';
import { HelperBox } from '../helper-box/HelperBox.tsx';
import { type HelperBoxCords } from '@interfaces/helperbox.ts';
import Show from '@defaults/Show.tsx';

import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import './welcome.scss';
import { onboardingSteps } from '@/app/constants/welcome-steps.tsx';

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

interface WelcomeGuideProps {
  close: () => void;
  startNext: () => void;
}

const getButtonCoordinates = (buttonId: string): HelperBoxCords[] => {
  const buttonElement = document.getElementById(buttonId);

  if (buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();

    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    const cardHeight = 275;
    const viewportHeight = window.innerHeight;
    const buttonCenterY = buttonRect.top + buttonHeight / 2;
    let top = buttonRect.top + window.scrollY;
    let left = buttonRect.left + window.scrollX + buttonWidth + 14;
    if (top + cardHeight > viewportHeight) {
      top = viewportHeight - cardHeight;
    }

    const arrowTop = buttonCenterY - top - 7;

    return [
      { top, left },
      { top: arrowTop, left: 0 },
    ];
  }
  return [{}, {}];
};

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

const WelcomeGuide: FC<WelcomeGuideProps> = ({ close, startNext }) => {
  const { getRole } = useUserRole();
  const [currentStep, setNextStep] = useState(defineInitialTour(getRole()));

  useEffect(() => {
    if (currentStep === WelcomeSteps.NOTHING) {
      startNext();
    }
  }, [currentStep]);

  if (currentStep === WelcomeSteps.NOTHING) {
    return null;
  }
  return (
    <div className="guide-container">
      {onboardingSteps.map(onboardingStep => {
        const coords = getButtonCoordinates(onboardingStep.buttonId);
        return (
          <Show
            key={onboardingStep.id}
            when={currentStep === onboardingStep.step && onboardingStep.roles.includes(getRole())}>
            <HelperBox
              close={close}
              next={() => setNextStep(onboardingStep.next)}
              coords={coords[0]}
              arrow={{ position: onboardingStep.arrowPosition, coordY: `${coords[1].top || 0}px` }}
              icon={onboardingStep.icon}
              title={onboardingStep.title}
              highlight={onboardingStep.highlight}
              text={onboardingStep.text}
            />
          </Show>
        );
      })}
    </div>
  );
};

export default WelcomeGuide;
