import { type FC } from 'react';

import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { TermsOfUse } from '@/app/views/components/TermsOfUse/TermsOfUse';
import FinishSignupForm from '@/app/views/components/forms/FinishSignupForm.tsx';

const FinishSignUpLayout: FC = () => (
  <FinishSignupForm>
    {(isLoading: boolean) => (
      <>
        <TermsOfUse />
        <div className="margin-top">
          <PrimaryButton text="Proceed" type="submit" isDisabled={isLoading} className="center" />
        </div>
      </>
    )}
  </FinishSignupForm>
);

export default FinishSignUpLayout;
