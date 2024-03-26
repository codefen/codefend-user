import { useState, type FC } from 'react';
import { useAuthState, useWelcomeUser } from '../../../../data';
import { ModalWrapper, PrimaryButton, Show } from '../../';
import './welcome.scss';

interface WelcomeModalProps {
	defaultOpenValue: boolean;
	closeModal: () => void;
	startGuide: () => void;
}

export const WelcomeModal: FC<WelcomeModalProps> = ({
	defaultOpenValue,
	closeModal,
	startGuide,
}) => {
	return (
		<Show when={defaultOpenValue}>
			<ModalWrapper action={closeModal}>
				<div className="welcome-modal-container">
					<header className="welcome-modal-header">
						<img
							src="/codefend/pentest-header-vector.svg"
							alt="codefend-icon"
							aria-label="codefend-icon"
							decoding="async"
						/>
						<h2>Welcome</h2>
					</header>

					<div className="welcome-content">
						<p>
							Welcome to Codefend. Do you want to take the entrance tour?
						</p>
					</div>

					<div className="welcome-btns">
						<PrimaryButton
							buttonStyle="red"
							text="Take a tour"
							disabledLoader
							click={startGuide}
						/>
						<PrimaryButton
							buttonStyle="gray"
							text="No, thanks"
							disabledLoader
							click={closeModal}
						/>
					</div>
				</div>
			</ModalWrapper>
		</Show>
	);
};
