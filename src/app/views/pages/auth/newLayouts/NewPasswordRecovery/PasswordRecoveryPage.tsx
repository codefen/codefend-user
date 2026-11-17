import { useState } from 'react';
import PasswordRecoveryForm from '@/app/views/components/forms/PasswordRecoveryForm.tsx';
import { ModalWrapper } from '@modals/index';
import css from '../NewSigninForm/signinform.module.scss';
import { ChangeAuthPages } from '@/app/views/pages/auth/newRegister/ChangeAuthPages/ChangeAuthPages';
import { useTheme } from '@/app/views/context/ThemeContext';

export const PasswordRecovery = () => {
  const [activePhase, setPhase] = useState<'email' | 'code'>('email');
  const { theme } = useTheme();

  return (
    <ModalWrapper showCloseBtn={false} type={`${css['signinform']} new-signin-form ${theme}`}>
      <div className={`${css['signinContent']} new-auth-content form-content`}>
        <ChangeAuthPages />
        <PasswordRecoveryForm activePhase={activePhase} setPhase={updated => setPhase(updated)}>
          {(isLoading: boolean) => (
            <button type="submit" className={`btn btn-red ${css['sendButton']}`} disabled={isLoading}>
              continue
            </button>
          )}
        </PasswordRecoveryForm>
      </div>
      <div className="new-auth-content readonly-content">
        <h1>
          Unveil the full attack surface...
          <br />
          <span>discover real threats</span>
        </h1>
        <p className="header-text">
          Start with a one domain or email. Codefend uncovers what's leaking, exposed or exploitable —
          before attackers do. Browse and scan across thousands of systems and millions of breached
          identities indexed. We are experts in blackbox operations.
        </p>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">
              <img src={import.meta.env.BASE_URL + 'codefend/Grupo-1.png?v=3'} alt="Professional hackers" />
            </div>
            <div className="feature-content">
              <h3>Professional hackers on demand</h3>
              <p>
                Hire professional hackers on demand, when you need them! Our professionals follow the
                same paths real attackers do.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <img src={import.meta.env.BASE_URL + 'codefend/icono-leaks.png?v=3'} alt="Database explorer" />
            </div>
            <div className="feature-content">
              <h3>Full dataleaks explorer</h3>
              <p>
                See what parts of your tech stack have already been leaked. Correlate your users with
                190B+ breached records and discover hidden threats.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <img src={import.meta.env.BASE_URL + 'codefend/icono-bicho.png?v=3'} alt="Attack surface map" />
            </div>
            <div className="feature-content">
              <h3>Automated attack surface map</h3>
              <p>
                Visualize the online exposure like never before. From one domain to your full
                infrastructure — unveil hosts, techs, live vulnerabilities and people and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
