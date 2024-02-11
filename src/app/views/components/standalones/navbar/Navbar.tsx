import React, { lazy } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
	NetworkSettingState,
	useModal,
	useNetworkSettingState,
} from '../../../../data';
import {
	ConfirmModal,
	LogoutIcon,
	ModalWrapper,
	NetworkIcon,
	Show,
	NetworkSetingModal,
} from '../..';
import './navbar.scss';
import useAuthStore from '../../../../data/store/auth.store';

const Logo = lazy(() => import('../../defaults/Logo'));

const Navbar: React.FC = () => {
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = () => {
		logout();
		navigate('/auth/signin');
	};

	return (
		<>
			<nav className="navbar">
				<Show when={showModal && showModalStr === 'logout'}>
					<ModalWrapper action={() => setShowModal(!showModal)}>
						<div
							className="modal-wrapper-title internal-tables disable-border"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}>
							<ConfirmModal
								header="ARE YOU SURE YOU WANT TO LOGOUT?"
								cancelText="Cancel"
								confirmText="Logout"
								close={() => setShowModal(!showModal)}
								action={() => handleLogout()}
							/>
						</div>
					</ModalWrapper>
				</Show>
				<Show when={isOpen}>
					<ModalWrapper action={() => setShowModal(!showModal)}>
						<div
							className="modal-wrapper-title internal-tables disable-border"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}>
							<div className="w-full mt-4">
								<div className="w-full px-8 disable-border">
									<NetworkSetingModal
										close={() => setShowModal(!showModal)}
									/>
								</div>
							</div>
						</div>
					</ModalWrapper>
				</Show>
				<div className="navbar-logo">
					<Link to="/">
						<span className="navbar-logo-container">
							<Logo theme="aim" />
						</span>
					</Link>
				</div>

				<div title="Logout" className="gap-x-6 flex items-center">
					<div
						title="Network Setting"
						onClick={() => {
							// setShowModal(!showModal);
							// setShowModalStr('network_setting');
							setNetworkSettingState(true);
						}}>
						<NetworkIcon width={1.35} height={1.35} />
					</div>

					<span
						className="navbar-logout-icon"
						onClick={(e: React.FormEvent) => {
							e.preventDefault();
							setShowModalStr('logout');
							setShowModal(!showModal);
						}}>
						<LogoutIcon />
					</span>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
