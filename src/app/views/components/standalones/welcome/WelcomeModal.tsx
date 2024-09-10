import { type FC, lazy } from 'react';
import { ModalWrapper, PrimaryButton, Show } from '../../';
import './welcome.scss';
import { Link } from 'react-router-dom';
import { useUserRole } from '#commonUserHooks/useUserRole';

const Logo = lazy(() => import('../../defaults/Logo'));

interface WelcomeModalProps {
  close: () => void;
  startNext: () => void;
}

export const WelcomeModal: FC<WelcomeModalProps> = ({ close, startNext }) => {
  const { isAdmin, isNormalUser } = useUserRole();
  return (
    <ModalWrapper action={close} type="med-max-w">
      <div className="welcome-modal-container">
        <header className="welcome-modal-header">
          <h2>welcome to codefend</h2>
        </header>

        <div className="welcome-content">
          <Logo theme="aimColor" />

          <div className="welcome-info">
            <h3>Hello and welcome to Codefend</h3>
            <p className="main-paragraph">
              We hope you have a pleasent experience across our holistic information security
              platform.{' '}
              <b>
                We would love to provide you a brief introduction before you start so you can have a
                nice experience across our services!
              </b>
            </p>
            {/* <ul className="list">
							<li>
								<Link
									to="https://www.codefend.com/services"
									target="_blank">
									1 - Learn more about codefend services
								</Link>
							</li>
							<li>
								<Link to="https://www.codefend.com" target="_blank">
									2 - Learn how to use the interface
								</Link>
							</li>
						</ul>*/}
            <Show when={isAdmin() || isNormalUser()}>
              <p className="take-guide">
                <b>Let's take a 2 minutes tour</b> across the application in order to explore the
                most relevant codefend features and capabilities!
              </p>
            </Show>
          </div>
        </div>

        <div className="welcome-btns">
          <PrimaryButton buttonStyle="black" text="close" disabledLoader click={close} />
          <PrimaryButton buttonStyle="red" text="Start tour" disabledLoader click={startNext} />
        </div>
      </div>
    </ModalWrapper>
  );
};
