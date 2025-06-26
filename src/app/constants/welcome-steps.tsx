import { Position } from '@interfaces/helperbox.ts';
import {
  AdminCompanyIcon,
  BugIcon,
  CLoudIcon,
  ChartIcon,
  GlobeWebIcon,
  MobileIcon,
  PeopleGroupIcon,
  SourceCodeIcon,
  LanIcon,
  MessageIcon,
  PreferenceIcon,
} from '@icons';
import type { ReactNode } from 'react';
import { generateID } from '@utils/helper';

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

interface OnboardingStep {
  id: string;
  step: WelcomeSteps;
  buttonId: string;
  next: WelcomeSteps;
  title: string;
  text: string;
  highlight: string;
  icon: ReactNode;
  arrowPosition: Position;
  roles: Array<string>;
  isLastStep?: boolean;
}

const generateUniqueId = () => generateID().substring(0, 10);

export enum ScanStepType {
  NonScan = 'nonScan',
  LAUNCHED = 'launched',
  Parser = 'parser',
  Finished = 'finished',
  Killed = 'killed',
}

// Asigna el numero del paso en el que se encuentra el scanner
// Es decir scanner se encuentra en la fase "Scanner" le digo al usuario que el scanner esta en fase "1"
export const scanStepnumber: Record<ScanStepType, number> = {
  nonScan: 0,
  launched: 1,
  parser: 2,
  finished: 3,
  killed: 3,
};

export const scanStepText: Record<ScanStepType, string> = {
  nonScan: 'Initializing Scanning.',
  launched: 'Searching for vulnerabilities.',
  parser: 'Analyzing vulnerabilities.',
  finished: 'Finishing the scan.',
  killed: 'The scan has been forcibly stopped.',
};

// Define los pasos, textos, iconos y roles del onboarding
export const onboardingSteps: OnboardingStep[] = [
  {
    id: generateUniqueId(),
    step: WelcomeSteps.ADMIN,
    next: WelcomeSteps.DASHBOARD,
    buttonId: 'sidebar_company',
    title: 'Any title for admin',
    text: 'Any description for admin Any description for admin Any description for admin Any description for adminAny description for admin Any description for admin',
    highlight: 'Any highlight text for admin',
    icon: <AdminCompanyIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.DASHBOARD,
    buttonId: 'sidebar_dashboard',
    next: WelcomeSteps.WEB,
    title: 'dashboard',
    text: 'In the dashboard you can find information about the most critical issues detected in your scope, and relevant details about your team and resources.',
    highlight: 'Have a brief of your security posture!',
    icon: <ChartIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.WEB,
    next: WelcomeSteps.MOBILE,
    buttonId: 'sidebar_web',
    title: 'web resources',
    text: 'From this section you can control all your web applications, add and remove domains and subdomains to your scope.',
    highlight: 'Add your web applications and start a pentest!',
    icon: <GlobeWebIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.MOBILE,
    next: WelcomeSteps.NET,
    buttonId: 'sidebar_mobile',
    title: 'mobile resources',
    text: 'From this section you can control all your mobile applications, and those employed by your team, add any application that you would like to audit.',
    highlight: 'Add your mobile applications and start a pentest!',
    icon: <MobileIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.NET,
    next: WelcomeSteps.CLOUD,
    buttonId: 'sidebar_net',
    title: 'network resources',
    text: 'From this section you can control all your network infrastructure, add network devices and IP addresses and unveil the security of these assets!',
    highlight: 'Define and pentest your network infrastructure',
    icon: <LanIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.CLOUD,
    next: WelcomeSteps.SOURCE,
    buttonId: 'sidebar_cloud',
    title: 'cloud resources',
    text: 'From this section you can control all your cloud infrastructure, add your cloud details and allow our experts to secure your infrastructure!',
    highlight: 'Add your cloud infrastructure and start a pentest!',
    icon: <CLoudIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.SOURCE,
    next: WelcomeSteps.SOCIAL,
    buttonId: 'sidebar_source',
    title: 'source code review',
    text: 'From this section you can control all your source code, add and remove code repositories to your scope, and request a manual analysis.',
    highlight: 'Add your source code and start a review!',
    icon: <SourceCodeIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.SOCIAL,
    next: WelcomeSteps.ISSUES,
    buttonId: 'sidebar_social',
    title: 'social resources',
    text: 'From this section you can control all your social media urls and request a manual analysis.',
    highlight: 'Add your social accounts and start a review!',
    icon: <PeopleGroupIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.ISSUES,
    next: WelcomeSteps.SUPPORT,
    buttonId: 'sidebar_issues',
    title: 'issues',
    text: 'From this section you can visualize all the reported security issues and obtain customer support in order to solve them.',
    highlight: 'See the vulnerabilities and detected issues',
    icon: <BugIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.SUPPORT,
    next: WelcomeSteps.PREFERENCES,
    buttonId: 'sidebar_support',
    title: 'codefend contact support',
    text: 'You can contact codefend’s customer support with any kind of security related matters that you have while your subscription is active!',
    highlight: 'Contact us at any time!',
    icon: <MessageIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
  },
  {
    id: generateUniqueId(),
    step: WelcomeSteps.PREFERENCES,
    next: WelcomeSteps.NOTHING,
    buttonId: 'sidebar_preferences',
    title: 'preferences',
    text: 'From this section you can update your user details, update security measures, administrate team members and see your invoices and orders.',
    highlight: 'Administrate preferences, team and your invoices!',
    icon: <PreferenceIcon />,
    arrowPosition: Position.LEFT,
    roles: ['admin', 'user'],
    isLastStep: true,
  },
];
