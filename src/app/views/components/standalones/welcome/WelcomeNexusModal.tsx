import { type FC, lazy } from 'react';
import { ModalWrapper, PrimaryButton, Show } from '../../';
import './welcome.scss';
import { Link } from 'react-router-dom';
import { useUserRole } from '#commonUserHooks/useUserRole';

const Logo = lazy(() => import('../../defaults/Logo'));

interface WelcomeNexusModalProps {
	close: () => void;
	startNext: () => void;
}

export const WelcomeNexusModal: FC<WelcomeNexusModalProps> = ({
	close,
	startNext,
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
						<p>
							<span className="weight-text">
								Nexus is bost netwrok of verified information security
								professionals available on demand
							</span>{' '}
							to analyze the security of your infrastructure
							<br />
							We combine the powerfull of this bost network of
							professionals with{' '}
							<span className="weight-text">
								online printable reports,
							</span>{' '}
							that will facilitate your organization to improve your
							security posture and obtain multiple certifications!
							<br />
							<span className="codefend-text-red">
								Additionally it presents vulnerability communication on
								promise,
							</span>{' '}
							idvidual entries per issue, with direct customer support.
							In top of that{' '}
							<span className="weight-text">
								all reported issues are verified
							</span>{' '}
							or discarded by our internal team of experts.
						</p>
					</div>
				</div>

				<div className="welcome-btns">
					<Show when={isAdmin() || isNormalUser()}>
						<PrimaryButton
							buttonStyle="red"
							text="Start tour"
							disabledLoader
							click={startNext}
						/>
					</Show>
					<Show when={isProvider() || isReseller()}>
						<PrimaryButton
							buttonStyle="red"
							text="Close"
							disabledLoader
							click={close}
						/>
					</Show>
				</div>
			</div>
		</ModalWrapper>
	);
};
