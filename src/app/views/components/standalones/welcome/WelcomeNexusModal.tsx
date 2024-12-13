import { type FC, lazy } from 'react';
import { ModalWrapper, PrimaryButton } from '../../';
import './welcome.scss';

const Logo = lazy(() => import('../../defaults/Logo'));

interface WelcomeNexusModalProps {
  close: () => void;
  startNext: () => void;
}

export const WelcomeNexusModal: FC<WelcomeNexusModalProps> = ({ close, startNext }) => {
  return (
    <ModalWrapper action={close} type="med-max-w">
      <div className="welcome-modal-container">
        <header className="welcome-modal-header">
          <h2>welcome to codefend</h2>
        </header>

        <div className="welcome-content">
          <Logo theme="aimColor" />
          {/* <img
							src="/codefend/pentest-header-vector.svg"
							alt="codefend-icon"
							aria-label="codefend-icon"
							decoding="async"
						/> */}
          <div className="welcome-info">
            <p>
              <span className="weight-text">
                Nexus is best network of verified information security professionals available on
                demand
              </span>{' '}
              to analyze the security of your infrastructure
              <br />
              <br />
              We combine the powerfull of this best network of professionals with{' '}
              <span className="weight-text">online printable reports,</span> that will facilitate
              your organization to improve your security posture and obtain multiple certifications!
              <br />
              <br />
              <span className="codefend-text-red">
                Additionally it presents vulnerability communication on promise,
              </span>{' '}
              individual entries per issue, with direct customer support. In top of that{' '}
              <span className="weight-text">all reported issues are verified</span> or discarded by
              our internal team of experts.
            </p>
          </div>
        </div>

        <div className="welcome-btns">
          <PrimaryButton buttonStyle="black" text="Close" disabledLoader click={close} />
          <PrimaryButton buttonStyle="red" text="Ok" disabledLoader click={startNext} />
        </div>
      </div>
    </ModalWrapper>
  );
};
