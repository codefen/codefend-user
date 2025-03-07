import { useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import PasswordRecoveryForm from '@/app/components/forms/PasswordRecoveryForm';
import { ModalWrapper } from '@modals/index';
import css from './recovery.module.scss';
import { Link, Navigate, useLocation } from 'react-router';
import useAuthStore from '@stores/auth.store';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { DashboardInvoke } from '@/app/components/DashboardInvoke/DashboardInvoke';
import DashboardAssets from '@/app/components/DashboardAssets/DashboardAssets';
import { RightItemButton } from '@/app/components/RightItemButton/RightItemButton';

const recoursesEmpty = {
  cloud: '0',
  lan: '0',
  mobile: '0',
  social: '0',
  source: '0',
  web: '0',
};

export const PasswordRecovery = () => {
  const [activePhase, setPhase] = useState<'email' | 'code'>('email');
  const [showScreen] = useShowScreen();
  const { isAuth } = useAuthStore(state => state);
  const location = useLocation();
  if (isAuth) {
    return <Navigate to={'/'} />;
  }
  return (
    <main className={`${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <ModalWrapper showCloseBtn={false} type={css['recoveryModal']}>
        <div className={css['recoveryContent']}>
          <img src="/codefend/brand-iso.png" width={350} height={60} />
          <div className={css['change-page-contaienr']}>
            <Link
              to="/signin"
              className={location.pathname === '/signin' ? css['active-link'] : ''}>
              Signin
            </Link>
            <Link
              to="/signup"
              className={location.pathname === '/signup' ? css['active-link'] : ''}>
              Signup
            </Link>
            <Link
              to="/recovery"
              className={location.pathname.startsWith('/recovery') ? css['active-link'] : ''}>
              Password recovery
            </Link>
          </div>
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
      <section className="left">
        <DashboardInvoke />
        <DashboardAssets resources={recoursesEmpty} />
      </section>
      <section className="right">
        <RightItemButton
          title="Add team members"
          description="Send us the first invitation"
          img="/codefend/add-collab.png"
        />
        <RightItemButton
          title="Add scope / attack surface"
          description="You can help us expand the scope."
          img="/codefend/add-scope.png"
        />
      </section>
    </main>
  );
};
