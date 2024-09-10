import { useEffect, useState, type FC } from 'react';
import { HelperBox } from '../helper-box/HelperBox.tsx';
import { type HelperBoxCords } from '@interfaces/helperbox.ts';

import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import './welcome.scss';
import { onboardingSteps } from '@/app/constants/welcome-steps.tsx';
import { addEventListener, withBatchedUpdates } from '@utils/helper.ts';
import { EVENTS } from '@/app/constants/events.ts';

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

const getInitialBox = (role: string) => {
  if (role === 'admin') {
    return WelcomeSteps.ADMIN;
  } else if (role == 'provider' || role === 'reseller') {
    return WelcomeSteps.NOTHING;
  }
  return WelcomeSteps.DASHBOARD;
};

const WelcomeGuide: FC<WelcomeGuideProps> = ({ close, startNext }) => {
  const { getRole } = useUserRole();
  const [currentStep, setNextStep] = useState(getInitialBox(getRole()));
  const [coords, setCoords] = useState<HelperBoxCords[][] | null>(null);
  useEffect(() => {
    const calcCoords = () => {
      const newCoords = onboardingSteps.map(onboardingStep =>
        getButtonCoordinates(onboardingStep.buttonId)
      );
      setCoords(newCoords);
    };
    const resizeUnsub = addEventListener(window, EVENTS.RESIZE, withBatchedUpdates(calcCoords));
    if (!coords) calcCoords();
    if (currentStep === WelcomeSteps.NOTHING) startNext();

    return () => resizeUnsub();
  }, [currentStep]);

  if (currentStep === WelcomeSteps.NOTHING) {
    return null;
  }

  return (
    <div className="guide-container">
      {onboardingSteps.map((onboardingStep, i) => {
        if (currentStep !== onboardingStep.step || !onboardingStep.roles.includes(getRole())) {
          return null;
        }
        const coordsI = coords?.[i] || getButtonCoordinates(onboardingStep.buttonId);
        return (
          <HelperBox
            key={onboardingStep.id}
            close={close}
            next={() => setNextStep(onboardingStep.next)}
            coords={coordsI[0]}
            arrow={{ position: onboardingStep.arrowPosition, coordY: `${coordsI[1].top || 0}px` }}
            icon={onboardingStep.icon}
            title={onboardingStep.title}
            highlight={onboardingStep.highlight}
            text={onboardingStep.text}
          />
        );
      })}
    </div>
  );
};

export default WelcomeGuide;
