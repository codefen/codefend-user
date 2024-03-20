import React, { lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	Breadcrumb,
	Show,
	ModalWrapper,
	ConfirmModal,
	ThemeChangerButton,
	MessageIcon,
	PreferenceIcon,
	NetworkIcon,
	LogoutIcon,
} from '../..';
import {
	usePanelStore,
	NetworkSettingState,
	useNetworkSettingState,
	useModal,
	useAuthState,
} from '../../../../data';
import { NavbarSubMenu } from './NavbarSubMenu';
import './navbar.scss';

const Logo = lazy(() => import('../../defaults/Logo'));

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const { logout, getUserdata } = useAuthState();
	const userData = getUserdata();
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
			<nav className="navbar">
				<div className="left">
					<div className="navbar-logo">
						<span className={`${open && 'rotate-360'}`}>
							<Logo theme="aim" onClick={() => handleChange()} />
						</span>
					</div>
					<Breadcrumb
						root="Codefend"
						rootAction={() => navigate('/admin/company')}
					/>
					<div className="actions">
						<div
							className="action"
							title="User preference"
							onClick={() => {
								navigate('/preferences');
							}}>
							<PreferenceIcon />
						</div>
						<div
							className="action"
							title="Customer support"
							onClick={() => {
								navigate('/support');
							}}>
							<MessageIcon />
						</div>
						<div
							className="action"
							title="Network settings"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<NetworkIcon width={1.1} height={1.1} />
							<span>{baseApiName}</span>
						</div>
						<ThemeChangerButton />
					</div>
				</div>

				<div className="right">
					<div className="actions">
						<div className="user action" ref={userRef}>
							<span className="email">
								{userData.email ?? 'not-found'}
							</span>
							<NavbarSubMenu
								isOpen={isMenuOpen}
								subMenuRef={dropdownRef}
								userFullname={userData.name + ' ' + userData.lastName}
								closeMenu={() => setMenuOpen(false)}
							/>
						</div>

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
