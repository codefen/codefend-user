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
import { useModal } from '../../../../../data';
import {
	useAuthStore,
	useNetworkSettingState,
	usePanelStore,
} from '../../../../../data/store';
import './NavResponsive.scss';

const NavResponsive: React.FC = () => {
	const { logout } = useAuthStore((state) => state);
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
		<footer className="flex flex-col">
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
							<div className="w-full px-8 disable-border xs:px-[1px] sm:px-[1px]">
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

				<div className="flex items-center gap-x-6">
						<div
							className="text-cyan-50"
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<MessageIcon width={1.35} height={1.35} />
						</div>
					</div>

					<div className="flex items-center gap-x-6">
						<div
							className="text-cyan-50"
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<PreferenceIcon  width={1.35} height={1.35} />
						</div>
					</div>



					<div className="max-w-[40px]">
						<span
							className={`cursor-pointer duration-500 ${
								open && 'rotate-[360deg]'
							}`}>
							<Logo theme="aim" onClick={() => handleChange()} />
						</span>
					</div>

					<div className="flex items-center gap-x-6">
						<div
							className="text-cyan-50"
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<NetworkIcon width={1.35} height={1.35} />
						</div>
					</div>

					<div className="text-cyan-50">
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
