import { useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import PasswordRecoveryForm from '@/app/views/components/forms/PasswordRecoveryForm.tsx';
import { ModalWrapper } from '@modals/index';
import css from './passwordrecovery.module.scss';
import { useLocation } from 'react-router';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';

export const PasswordRecovery = () => {
  const [activePhase, setPhase] = useState<'email' | 'code'>('email');
  const location = useLocation();
  return (
    <ModalWrapper showCloseBtn={false} type={css['passwordRecoveryForm']}>
      <div className={css['passwordRecoveryContent']}>
        <ChangeAuthPages pathname={location.pathname} />
        <PasswordRecoveryForm activePhase={activePhase} setPhase={updated => setPhase(updated)}>
          {(isLoading: boolean) => (
            <div className={css['confirm-button']}>
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
      </div>
    </ModalWrapper>
  );
};
