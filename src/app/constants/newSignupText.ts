export enum SignUpSteps {
  STEP_ONE = 1,
  STEP_TWO = 2,
  STEP_THREE = 3,
  STEP_FOUR = 4,
}

export const STEPSDATA: Record<SignUpSteps, any> = {
  [SignUpSteps.STEP_ONE]: {
    p: 'Welcome. Codefend is a comprehensive platform for continuous pentesting, early threat detection, and the protection of assets and infrastructure, leveraging a decentralized network of hackers specialized in various fields.',
    label: 'Personal details',
  },
  [SignUpSteps.STEP_TWO]: {
    p: "We will attempt to hack you as soon as possible. We conduct all kinds of tests on your company's attack surface, from conventional pentesting to data leak detection, advanced social engineering techniques, and more.",
    label: 'Business details',
  },
  [SignUpSteps.STEP_THREE]: {
    p: 'As soon as we begin, once you create your account, we will assist you with onboarding your first asset and conduct a series of automated tests using scanners and artificial intelligence. These automated results should be considered provisional.',
    label: 'Verify your email address',
  },
  [SignUpSteps.STEP_FOUR]: {
    p: "We will try to hack you as soon as possible. We conduct all kinds of tests on your company's attack surface, from conventional pentesting to data leak detection, advanced social engineering techniques, and more.",
    label: 'Add your password',
  },
};
