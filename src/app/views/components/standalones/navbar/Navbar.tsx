import React, { lazy } from 'react';
import { useNavigate } from 'react-router';
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
import { usePanelStore } from '../../../../data/store/panel.store';

const Logo = lazy(() => import('../../defaults/Logo'));

const Navbar: React.FC = () => {
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);
	const { open, handleChange } = usePanelStore();

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
					<ModalWrapper action={() => setNetworkSettingState(!isOpen)}>
						<div
							className="modal-wrapper-title internal-tables disable-border"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}>
							<div className="w-full mt-4">
								<div className="w-full px-8 disable-border">
									<NetworkSetingModal
										close={() => setNetworkSettingState(!isOpen)}
									/>
								</div>
							</div>
						</div>
					</ModalWrapper>
				</Show>
				<div className="navbar-logo">
					<span
						className={`cursor-pointer duration-500 ${
							open && 'rotate-[360deg]'
						}`}>
						<Logo 
							theme="aim" 
							onClick={() => handleChange()} 
						/>
					</span>
				</div>

				<div title="Logout" className="flex items-center gap-x-6">
					<div
						title="Network Setting"
						onClick={() => {
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
