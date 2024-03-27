import { useState, type FC } from 'react';
import { useAuthState, useWelcomeUser } from '../../../../data';
import { ModalWrapper, PrimaryButton, Show } from '../../';
import './welcome.scss';
import { Link } from 'react-router-dom';

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
						<h2>Be welcome to codefend!</h2>
					</header>

					<div className="welcome-content">
						<img
							src="/codefend/pentest-header-vector.svg"
							alt="codefend-icon"
							aria-label="codefend-icon"
							decoding="async"
						/>
						<div className="welcome-info">
							<h3>Helo there! and welcome to Codefend!</h3>
							<p className="main-paragraph">
								We hope you hace a pleasent experience across our
								holistic information security platform.{' '}
								<b>
									We would love to provide you a brief introduction
									before you start so you can have a nice experience
									across our services!
								</b>
							</p>
							{/* https://www.codefend.com/services */}
							<ul className="list">
								<li>
									<Link
										to="https://www.codefend.com/services"
										target="_blank">
										1 - Learn more about codefend services
									</Link>
								</li>
								<li>
									<Link
										to="https://www.codefend.com/services"
										target="_blank">
										2 - Learn how to use the interface
									</Link>
								</li>
							</ul>
							<p className="take-guide">
								<b>Let's take a 5 minutes tour</b> acriss the
								application in order to explore the most relevant
								codefend features and capabilities!
							</p>
						</div>
					</div>

					<div className="welcome-btns">
						<PrimaryButton
							buttonStyle="gray"
							text="Cancel tour"
							disabledLoader
							click={closeModal}
						/>
						<PrimaryButton
							buttonStyle="red"
							text="Continue tour"
							disabledLoader
							click={startGuide}
						/>
					</div>
				</div>
			</ModalWrapper>
		</Show>
	);
};
