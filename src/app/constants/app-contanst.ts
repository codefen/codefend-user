import { ResourcesTypes } from '@interfaces/order';

export enum ButtonStyles {
  RED = 'red',
  BLACK = 'black',
  DARK_RED = 'dark-red',
  GRAY = 'gray',
  SEND = 'send',
  DEFAULT = 'default',
  DARK_BLACK = 'dark-black',
}

const PLAN_IMAGE = {
  small: '/codefend/small-plan.png',
  medium: '/codefend/medium-plan.png',
  advanced: '/codefend/advanced-plan.png',
};

export class AppConstants {
  public static readonly BUTTON_STYLES: Record<ButtonStyles, string> = {
    [ButtonStyles.RED]: 'btn-red',
    [ButtonStyles.BLACK]: 'btn-black',
    [ButtonStyles.GRAY]: 'btn-gray',
    [ButtonStyles.SEND]: 'btn-red send-btn',
    [ButtonStyles.DARK_RED]: 'btn-dark-red',
    [ButtonStyles.DEFAULT]: '',
    [ButtonStyles.DARK_BLACK]: 'btn-dark-black',
  };
  public static readonly PLAN_PREFERENCE_MAP = {
    [ResourcesTypes.WEB]: {
      planTitle:
        'Exclusive small plans for web applications offer a unique combination of <b>automatic scanners, specialized technical assistance</b> and <b>dataleaks search</b>. All provide limited access to the platform with report creation and issue visualization.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'basic one-time analysis',
        list: [
          'Recommended maximum of <b>2 domains.</b>',
          'Recommended maximum of <b>6 subdomains.</b>',
          'Domain value: <b>normal.</b>',
          'Neuroscan: <b>5 automated scans.</b>',
          'Dataleaks search: <b>10 searches.</b>',
          '<b>40 hours</b> of manual pentest.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. Recommended maximum of 2 domains. Recommended maximum of 6 subdomains. Domain value: normal. Neuroscan: 5 automated scans. Dataleaks search: 10 searches. 40 hours of manual pentest.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'intermediate one-time analysis',
        list: [
          'Recommended maximum of <b>5 domains.</b>',
          'Recommended maximum of <b>15 subdomains.</b>',
          'Domain value: <b>normal.</b>',
          'Neuroscan: <b>10 automated scans.</b>',
          'Dataleaks search: <b>20 searches.</b>',
          '<b>120 hours</b> of manual pentest.',
        ],
        title: 'Medium pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. Recommended maximum of 5 domains. Recommended maximum of 15 subdomains. Domain value: normal. Neuroscan: 15 automated scans. Dataleaks search: 30 searches. 120 hours of manual pentest.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'advanced one-time analysis',
        list: [
          'Recommended maximum of <b>10 to 15 domains.</b>',
          'Recommended maximum of <b>30 subdomains.</b>',
          'Domain value: <b>high.</b>',
          'Neuroscan: <b>60 automated scans.</b>',
          'Dataleaks search: <b>60 searches.</b>',
          '<b>360 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for established businesses. Recommended maximum of 10 to 15 domains. Recommended maximum of 30 subdomains. Domain value: high. Neuroscan: 60 automated scans. Dataleaks search: 60 searches. 360 hours of manual pentest.',
      },
    },
    [ResourcesTypes.MOBILE]: {
      planTitle:
        'Exclusive small plans for XXXXXX offer a unique combination of <b>automatic scanners, specialized technical assistance</b> and <b>dataleaks search</b>. All provide limited access to the platform with report creation and issue visualization.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'basic one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX users.</b>',
          'Recommended maximum of <b>XXXX ratings.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>5 automated scans.</b>',
          'Dataleaks search: <b>10 searches.</b>',
          '<b>40 hours</b> of manual pentest.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'intermediate one-time analysis',
        list: [
          'Recommended maximum of <b>5,000 users.</b>',
          'Recommended maximum of <b>1,000 ratings.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>10 automated scans.</b>',
          'Dataleaks search: <b>20 searches.</b>',
          '<b>120 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'advanced one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX users.</b>',
          'Recommended maximum of <b>XXXX ratings.</b>',
          'Application value: <b>high.</b>',
          'Neuroscan: <b>60 automated scans.</b>',
          'Dataleaks search: <b>60 searches.</b>',
          '<b>360 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.NETWORK]: {
      planTitle:
        'Exclusive small plans for web applications offer a unique combination of <b>automatic scanners, specialized technical assistance</b> and <b>dataleaks search</b>. All provide limited access to the platform with report creation and issue visualization.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'basic one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>5 automated scans.</b>',
          'Dataleaks search: <b>10 searches.</b>',
          '<b>40 hours</b> of manual pentest.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'intermediate one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>10 automated scans.</b>',
          'Dataleaks search: <b>20 searches.</b>',
          '<b>120 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'advanced one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>high.</b>',
          'Neuroscan: <b>60 automated scans.</b>',
          'Dataleaks search: <b>60 searches.</b>',
          '<b>360 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.SOCIAL]: {
      planTitle:
        'Exclusive small plans for web applications offer a unique combination of <b>automatic scanners, specialized technical assistance</b> and <b>dataleaks search</b>. All provide limited access to the platform with report creation and issue visualization.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'basic one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>5 automated scans.</b>',
          'Dataleaks search: <b>10 searches.</b>',
          '<b>40 hours</b> of manual pentest.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'intermediate one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>10 automated scans.</b>',
          'Dataleaks search: <b>20 searches.</b>',
          '<b>120 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'advanced one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>high.</b>',
          'Neuroscan: <b>60 automated scans.</b>',
          'Dataleaks search: <b>60 searches.</b>',
          '<b>360 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.CLOUD]: {
      planTitle:
        'Exclusive small plans for web applications offer a unique combination of <b>automatic scanners, specialized technical assistance</b> and <b>dataleaks search</b>. All provide limited access to the platform with report creation and issue visualization.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'basic one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>5 automated scans.</b>',
          'Dataleaks search: <b>10 searches.</b>',
          '<b>40 hours</b> of manual pentest.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'intermediate one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>10 automated scans.</b>',
          'Dataleaks search: <b>20 searches.</b>',
          '<b>120 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'advanced one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>high.</b>',
          'Neuroscan: <b>60 automated scans.</b>',
          'Dataleaks search: <b>60 searches.</b>',
          '<b>360 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.CODE]: {
      planTitle:
        'Exclusive small plans for web applications offer a unique combination of <b>automatic scanners, specialized technical assistance</b> and <b>dataleaks search</b>. All provide limited access to the platform with report creation and issue visualization.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'basic one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>5 automated scans.</b>',
          'Dataleaks search: <b>10 searches.</b>',
          '<b>40 hours</b> of manual pentest.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'intermediate one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>normal.</b>',
          'Neuroscan: <b>10 automated scans.</b>',
          'Dataleaks search: <b>20 searches.</b>',
          '<b>120 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'advanced one-time analysis',
        list: [
          'Recommended maximum of <b>XXXX.</b>',
          'Application value: <b>high.</b>',
          'Neuroscan: <b>60 automated scans.</b>',
          'Dataleaks search: <b>60 searches.</b>',
          '<b>360 hours</b> of manual pentest.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
  };
}
