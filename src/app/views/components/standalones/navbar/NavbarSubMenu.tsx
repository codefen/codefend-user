import { type FC } from 'react';
import { useNavigate } from 'react-router';
import {
	ConfirmModal,
	LogoutIcon,
	ModalWrapper,
	NetworkSetingModal,
	Show,
} from '../..';
import {
	type NetworkSettingState,
	useAuthState,
	useModal,
	useNetworkSettingState,
} from '../../../../data';

interface NavbarSubMenuProps {
	subMenuRef: any;
	isOpen: boolean;
	closeMenu: () => void;
	userFullname: string;
	userProfile?: string;
}

export const NavbarSubMenu: FC<NavbarSubMenuProps> = (props) => {
	const navigate = useNavigate();
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	const { logout } = useAuthState();
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();

	return (
		<>
			<Show when={showModal && showModalStr === 'logout'}>
				<ModalWrapper action={() => setShowModal(!showModal)}>
					<div
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}>
						<ConfirmModal
							header="ARE YOU SURE YOU WANT TO LOGOUT?"
							cancelText="Cancel"
							confirmText="Logout"
							close={() => setShowModal(!showModal)}
							action={() => {
								logout();
								navigate('/auth/signin');
							}}
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
			<div
				className={`menu ${props.isOpen ? 'active' : ''}`}
				ref={props.subMenuRef}
				id="menu-navbar"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				<div className="user">
					{/* <div className="profile"></div> */}
					<span
						className="username"
						title={props.userFullname}
						aria-label={props.userFullname}>
						{props.userFullname}
					</span>
				</div>
				<div className="options">
					{/* <div
						className="option"
						onClick={() => {
							props.closeMenu();
							navigate('/preferences');
						}}>
						<PreferenceIcon width={1.25} height={1.25} />
						<span className="text-options">User preference</span>
						<ChevronIcon width={0.65} height={0.65} />
					</div> */}
					{/* <div
						className="option"
						onClick={() => {
							props.closeMenu();
							navigate('/support');
						}}>
						<MessageIcon width={1.25} height={1.25} />
						<span className="text-options">Customer support</span>
						<ChevronIcon width={0.65} height={0.65} />
					</div> */}
					{/* <div
						className="option"
						onClick={() => {
							props.closeMenu();
							setNetworkSettingState(true);
						}}>
						<NetworkIcon width={1.25} height={1.25} />
						<span className="text-options">Netowork Setting</span>
						<ChevronIcon width={0.65} height={0.65} />
					</div> */}

					{/* <div className="option">
						<ThemeChangerButton activeText />
					</div> */}
					<div
						className="option"
						onClick={(e: React.FormEvent) => {
							props.closeMenu();
							setShowModalStr('logout');
							setShowModal(true);
						}}>
						<LogoutIcon width={1.25} height={1.25} />
						<span className="text-options">Logout</span>
					</div>
				</div>
			</div>
		</>
	);
};
