import { type FC, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ThemeChangerButton } from '@buttons/theme-changer/ThemeChangerButton.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { Breadcrumb } from '@standalones/utils/Breadcrumb.tsx';
import { LogoutIcon, NetworkIcon } from '@icons';
import Show from '@defaults/Show.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import { NetworkSetingModal } from '@modals/network-modal/NetworkSetingModal.tsx';
import { NavbarSubMenu } from './NavbarSubMenu.tsx';
import { usePanelStore } from '../../../../data';
import useModal from '#commonHooks/useModal.ts';
import type { NetworkSettingState } from '@stores/apiLink.store.ts';
import useNetworkSettingState from '@stores/apiLink.store.ts';
import './navbar.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { useUserData } from '#commonUserHooks/useUserData.ts';

const Logo = lazy(() => import('../../defaults/Logo'));

const Navbar: FC = () => {
	const navigate = useNavigate();
	const { logout, getUserdata } = useUserData();
	const userData = getUserdata();
	const { isAdmin } = useUserRole();
	const { open, handleChange } = usePanelStore();
	const [isMenuOpen, setMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const userRef = useRef<HTMLDivElement>(null);
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	const [baseApiName, setBaseApiName] = useState('');
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();

	useEffect(() => {
		const handleClickOutsideMenu = (event: any) => {
			if (
				dropdownRef.current &&
				userRef.current &&
				!dropdownRef.current.contains(event.target) &&
				!userRef.current.contains(event.target)
			) {
				setMenuOpen(false);
			}
		};

		// Detect if they clicked outside the dropdown
		document.addEventListener('mousedown', handleClickOutsideMenu);
		setBaseApiName('kundalini');
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenu);
		};
	}, []);

	const rootAction = () => {
		navigate('/');
	};
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
			{isAdmin() && (
				<NetworkSetingModal
					close={() => setNetworkSettingState(!isOpen)}
					isOpen={isOpen}
				/>
			)}

			<nav className="navbar">
				<div className="left">
					<div className="navbar-logo">
						<span className={`${open && 'rotate-360'}`}>
							<Logo theme="aim" onClick={() => handleChange()} />
						</span>
					</div>
					<Breadcrumb root="Codefend" rootAction={rootAction} />
					<div className="actions"></div>
				</div>

				<div className="right">
					<div className="actions">
						{isAdmin() && (
							<div
								className="action"
								title="Network settings"
								onClick={() => {
									setNetworkSettingState(true);
								}}>
								<NetworkIcon width={1.1} height={1.1} />
								<span>{baseApiName}</span>
							</div>
						)}
						<div className="user action" ref={userRef}>
							<span className="email">
								{userData.email || 'not-found'}
							</span>
							<NavbarSubMenu
								isOpen={isMenuOpen}
								subMenuRef={dropdownRef}
								userFullname={userData.fname + ' ' + userData.lname}
								closeMenu={() => setMenuOpen(false)}
							/>
						</div>
						<ThemeChangerButton />
						<div
							className="action logout"
							title="Logout"
							onClick={(e: React.FormEvent) => {
								setShowModalStr('logout');
								setShowModal(true);
							}}>
							<LogoutIcon width={1.1} height={1.1} />
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
