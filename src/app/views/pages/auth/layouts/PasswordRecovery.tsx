import { useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import PasswordRecoveryForm from '@/app/components/forms/PasswordRecoveryForm';

export const PasswordRecovery = () => {
  const [activePhase, setPhase] = useState<'email' | 'code'>('email');
  return (
    <PasswordRecoveryForm activePhase={activePhase} setPhase={updated => setPhase(updated)}>
      {(isLoading: boolean) => (
        <div className="confirm-button">
          <PrimaryButton
            text="Proceed"
            type="submit"
            buttonStyle="red"
            isDisabled={isLoading}
            disabledLoader
          />
        </div>
      )}
    </PasswordRecoveryForm>
  );
};
