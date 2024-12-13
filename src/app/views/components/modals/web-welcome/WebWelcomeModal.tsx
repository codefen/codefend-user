import { ModalWrapper } from '..';
import { GlobeWebIcon, PrimaryButton } from '../..';

import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import WebDomainForm from '../../forms/WebDomainForm';
import '@styles/welcome-guides.scss';

const WebWelcomeModal = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const close = () => {
    setIsOpen(false);
    setModalId('');
  };

  if (isOpen && modalId == MODAL_KEY_OPEN.WEB_WELCOME) {
    return (
      <ModalWrapper action={close}>
        <div className="welcome-container">
          <header className="welcome-header">
            <div className="welcome-header-title">
              <img
                src="/codefend/pentest-header-vector.svg"
                alt="codefend-icon"
                aria-label="codefend-icon"
              />
              <h2>
                <span>Welcome to</span>codefend
              </h2>
            </div>
          </header>

          <div className="welcome-content">
            <div className="step-header">
              <h3>Add a new web resource</h3>
            </div>
            <div className="step-content web-welcome">
              <div className="welcome-main-info">
                <GlobeWebIcon />
                <div className="welcome-main-text">
                  <p>
                    From this section, you can add new web resources like websites and web
                    applications
                  </p>
                  <p>
                    <span className="codefend-text-red">Launch a pentest.</span> Once you have
                    loaded all the desired resources you can request a web application penetration
                    test to check their security.
                  </p>
                </div>
              </div>

              <WebDomainForm onDone={close}>
                {isLoading => (
                  <div className="button-wrapper next-btns">
                    <PrimaryButton
                      text="Cancel"
                      click={close}
                      className="full"
                      buttonStyle="black"
                      disabledLoader
                    />
                    <PrimaryButton
                      text="Add web resource"
                      className="full"
                      buttonStyle="red"
                      type="submit"
                      isDisabled={isLoading}
                    />
                  </div>
                )}
              </WebDomainForm>
            </div>
          </div>
        </div>
      </ModalWrapper>
    );
  } else {
    return null;
  }
};

export default WebWelcomeModal;
