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
    p: "We conduct all kinds of tests on your company's attack surface, from conventional pentesting to data leak detection, advanced social engineering techniques, and more.",
    label: 'Business details',
  },
  [SignUpSteps.STEP_THREE]: {
    p: 'As soon as we begin, once you create your account, we will assist you with onboarding your first asset and conduct a series of automated tests using scanners and artificial intelligence. These automated results should be considered provisional.',
    label: 'Verify your email address',
  },
  [SignUpSteps.STEP_FOUR]: {
    p: 'Done! We’ve reached the final step—now you just need to set your password to access the system and start your free trial. Your password must contain 1 number, 1 letter, 12 characters, and a symbol.',
    label: 'Add your password',
  },
};

export const idiomOptions = [
  { value: '', label: 'Idiom', hidden: true },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ar', label: 'العربية' },
];
