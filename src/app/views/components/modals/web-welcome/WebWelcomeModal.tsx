import { useState } from 'react';

import { ModalWrapper } from '..';
import { GlobeWebIcon, PrimaryButton } from '../..';

import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import WebDomainForm from '../../forms/WebDomainForm';
import './web-welcome-guide.scss';

const WebWelcomeModal = () => {
	const { isOpen, modalId, setIsOpen } = useModalStore();
	const [isNextStep, updateNextStep] = useState(false);

	const close = () => setIsOpen(false);

	if (isOpen || modalId == MODAL_KEY_OPEN.WEB_WELCOME) {
		//if (true) {
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
							{/*
                            <ActiveProgressiveSteps
								orderStepActive={orderStepActive}
							/>
                            */}
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
										From this section, you can add new web resources
										like websites and web applications
									</p>
									<p>
										<span className="codefend-text-red">
											Launch a pentest.
										</span>{' '}
										Once you have loaded all the desired resources you
										can request a web application penetration test to
										check their security.
									</p>
								</div>
							</div>

							<WebDomainForm>
								{(isLoading) => (
									<div className="button-wrapper next-btns">
										<PrimaryButton
											text="Cancel"
											click={() => {}}
											className="full"
											buttonStyle="black"
											disabledLoader
										/>
										<PrimaryButton
											text="Add web resource"
											className="full"
											buttonStyle="red"
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
		return <></>;
	}
};

export default WebWelcomeModal;
