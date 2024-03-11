import React from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../..';
import {
	ConfirmModal,
	LogoutIcon,
	MessageIcon,
	ModalWrapper,
	NetworkIcon,
	NetworkSetingModal,
	PreferenceIcon,
	Show,
} from '../../..';
import { useAuthState, useModal } from '../../../../../data';
import {
	useNetworkSettingState,
	usePanelStore,
} from '../../../../../data/store';
import './NavResponsive.scss';

const NavResponsive: React.FC = () => {
	const { logout } = useAuthState();
	const { open, handleChange } = usePanelStore();
	const { setNetworkSettingState, isOpen } = useNetworkSettingState(
		(state) => state,
	);
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/auth/signin');
	};

	return (
		<footer className="nav-response-container">
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
						<div className="network-modal-container">
							<div className="network-modal-content disable-border">
								<NetworkSetingModal
									close={() => setNetworkSettingState(!isOpen)}
								/>
							</div>
						</div>
					</div>
				</ModalWrapper>
			</Show>

			<div className="sidebav">
				<div className="sideContent">
					<div className="sidenav-btns">
						<div
							className="sidenav-cyan-color"
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<MessageIcon width={1.35} height={1.35} />
						</div>
					</div>

					<div className="sidenav-btns">
						<div
							className="sidenav-cyan-color"
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<PreferenceIcon width={1.35} height={1.35} />
						</div>
					</div>

					<div className="sidenav-logo">
						<span className={`rotate ${open ? 'open' : ''}`}>
							<Logo theme="aim" onClick={() => handleChange()} />
						</span>
					</div>

					<div className="sidenav-btns">
						<div
							className="sidenav-cyan-color"
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<NetworkIcon width={1.35} height={1.35} />
						</div>
					</div>

					<div className="sidenav-cyan-color">
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
				</div>
			</div>
		</footer>
	);
};

export default NavResponsive;
