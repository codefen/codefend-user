import { ModalWrapper } from '@modals/index';
import { useState } from 'react';
import css from './signinform.module.scss';

enum SignUpSteps {
  STEP_ONE,
  STEP_TWO,
  STEP_THREE,
  STEP_FOUR,
}

const STEPSDATA: Record<SignUpSteps, any> = {
  [SignUpSteps.STEP_ONE]: {
    p: 'Welcome. Codefend is a comprehensive platform for continuous pentesting, early threat detection, and the protection of assets and infrastructure, leveraging a decentralized network of hackers specialized in various fields.',
  },
  [SignUpSteps.STEP_TWO]: {
    p: "We will attempt to hack you as soon as possible. We conduct all kinds of tests on your company's attack surface, from conventional pentesting to data leak detection, advanced social engineering techniques, and more.",
  },
  [SignUpSteps.STEP_THREE]: {
    p: 'As soon as we begin, once you create your account, we will assist you with onboarding your first asset and conduct a series of automated tests using scanners and artificial intelligence. These automated results should be considered provisional.',
  },
  [SignUpSteps.STEP_FOUR]: {
    p: "We will try to hack you as soon as possible. We conduct all kinds of tests on your company's attack surface, from conventional pentesting to data leak detection, advanced social engineering techniques, and more.",
  },
};

export const SignupForm = () => {
  const [activeStep, __setActiveStep] = useState(SignUpSteps.STEP_ONE);
  return (
    <ModalWrapper showCloseBtn={false} type={css['signinform']}>
      <div>
        <img src="" width={150} height={50} />
        <p>{STEPSDATA[activeStep].p}</p>
      </div>
    </ModalWrapper>
  );
};
