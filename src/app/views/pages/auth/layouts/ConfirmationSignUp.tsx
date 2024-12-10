import { type FC } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import ConfirmationForm from '@/app/views/components/forms/ConfirmationForm';

const ConfirmationSignUp: FC = () => (
  <ConfirmationForm>
    {(isLoading: boolean) => (
      <div className="confirm-button">
        <PrimaryButton text="Assistance" click={() => {}} buttonStyle="black" disabledLoader />
        <PrimaryButton text="Proceed" type="submit" isDisabled={isLoading} buttonStyle="red" />
      </div>
    )}
  </ConfirmationForm>
);

export default ConfirmationSignUp;
