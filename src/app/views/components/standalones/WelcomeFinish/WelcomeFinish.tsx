import { ModalWrapper } from '@modals/index';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './welcomefinish.module.scss';
import { useEffect } from 'react';

export const WelcomeFinish = ({ solved }: { solved: () => void }) => {
  const { initialDomain, isFirstClose, setFirstClose, setScanRunning, setScanStep } =
    useWelcomeStore();

  const closeModal = () => {
    setFirstClose(false);
    setScanRunning(true);
    setScanStep('nonScan');
    solved();
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']}>
      <div>
        <img src="/codefend/brand-iso.png" width={350} height={60} />
        <p className={css['welcome-text']}>
          <b>The domain {initialDomain} is being analyzed.</b> Detected vulnerabilities and
          potential threats will be displayed on the dashboard and communicated via email.{' '}
          <b>You can now close this modal.</b>
        </p>

        <img
          src="/codefend/loader_full_size.png"
          alt="loader"
          className={css['loader-animate-spin']}
          width={240}
          height={240}
        />
        <div className={css['finish-text']}>
          <p>
            <b>Current phase 1/3:</b>
          </p>
          <p>Running dynamic tests on the scope for vulnerability detection...</p>
        </div>

        <button disabled className={`btn ${css['btn-close']}`} onClick={closeModal}>
          Close
        </button>
      </div>
    </ModalWrapper>
  );
};
