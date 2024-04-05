import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { LogoutIcon } from '@icons';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';

import Show from '@defaults/Show.tsx';
import useModal from '#commonHooks/useModal.ts';
import { useAuthState } from '#commonHooks/useAuthState.ts';
import type { NetworkSettingState } from '@stores/apiLink.store.ts';
import useNetworkSettingState from '@stores/apiLink.store.ts';

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
