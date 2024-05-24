import { type FC, lazy } from 'react';
import { ModalWrapper, PrimaryButton, Show } from '../../';
import './welcome.scss';
import { Link } from 'react-router-dom';
import { useUserRole } from '#commonUserHooks/useUserRole';

const Logo = lazy(() => import('../../defaults/Logo'));

interface WelcomeModalProps {
	closeModal: () => void;
	startGuide: () => void;
	startLoadResource: () => void;
}

export const WelcomeModal: FC<WelcomeModalProps> = ({
	closeModal,
	startLoadResource,
}) => {
	const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
	return (
		<ModalWrapper action={() => {}} type="max-w">
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
						<h3>Hello and welcome to Codefend</h3>
						<p className="main-paragraph">
							We hope you have a pleasent experience across our holistic
							information security platform.{' '}
							<b>
								We would love to provide you a brief introduction before
								you start so you can have a nice experience across our
								services!
							</b>
						</p>
						<ul className="list">
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
						</ul>
						<Show when={isAdmin() || isNormalUser()}>
							<p className="take-guide">
								<b>Let's take a 2 minutes tour</b> across the
								application in order to explore the most relevant
								codefend features and capabilities!
							</p>
						</Show>
					</div>
				</div>

				<div className="welcome-btns">
					<Show when={isAdmin() || isNormalUser()}>
						<PrimaryButton
							buttonStyle="red"
							text="Start tour"
							disabledLoader
							click={startLoadResource}
						/>
					</Show>
					<Show when={isProvider() || isReseller()}>
						<PrimaryButton
							buttonStyle="red"
							text="Close"
							disabledLoader
							click={closeModal}
						/>
					</Show>
				</div>
			</div>
		</ModalWrapper>
	);
};
