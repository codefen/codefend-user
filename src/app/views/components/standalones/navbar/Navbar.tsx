import React, { lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumb, ThemeChangerButton, MessageIcon, PreferenceIcon, NetworkIcon } from '../..';
import { usePanelStore, NetworkSettingState, useNetworkSettingState } from '../../../../data';
import useAuthStore from '../../../../data/store/auth.store';
import { NavbarSubMenu } from './NavbarSubMenu';
import './navbar.scss';

const Logo = lazy(() => import('../../defaults/Logo'));

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const { userData } = useAuthStore((state) => state);
	const { open, handleChange } = usePanelStore();
	const [isMenuOpen, setMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const userRef = useRef<HTMLDivElement>(null);
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	const [baseApiName, setBaseApiName] = useState('');
	


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
		const baseApi = localStorage.getItem('baseApi');
		if (baseApi) {
			// Encontrar la posición del primer punto después de //
			const firstDotIndex = baseApi.indexOf('//') + 2; // Sumamos 2 para empezar después de //
	  
			// Extraer la parte de la URL desde // hasta el primer punto
			const extractedUrl = baseApi.substring(firstDotIndex, baseApi.indexOf('.', firstDotIndex));
	  
			// Mostrar la URL extraída en la consola (puedes usarla según tus necesidades)
			setBaseApiName(extractedUrl)
			
		  }

		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenu);
		};
	}, []);
	return (
		<>
			<nav className="navbar">
				<div className="left">
					<div className="navbar-logo">
						<span
							className={`cursor-pointer duration-500 ${open && 'rotate-[360deg]'
								}`}>
							<Logo theme="aim" onClick={() => handleChange()} />
						</span>
					</div>
					<Breadcrumb
						root="Codefend"
						rootAction={() => navigate('/admin/company')}
					/>
					<div className='actions'>
						<div
							className="action"
							title="User preference"
							onClick={() => {
								navigate('/preferences');
							}}>
							<PreferenceIcon/>
						</div>
						<div
							className="action"
							title="Customer support"
							onClick={() => {
								navigate('/support');
							}}>
							<MessageIcon/>
						</div>
						<div
							className="action"
							title="Network settings"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<NetworkIcon/>
							<span>{baseApiName}</span>
						</div>
						{/* <div className="action">
							<ThemeChangerButton />
						</div> */}
					</div>
				</div>

				<div className="right">
					<div className='actions'>
		

						<div
							className="user action"
							ref={userRef}
							onClick={(e) => {
								e.preventDefault();
								setMenuOpen((current) => !current);
							}}>
							<span className="email">{userData.email ?? 'not-found'}</span>
							<div className="profile"></div>
							<NavbarSubMenu
								isOpen={isMenuOpen}
								subMenuRef={dropdownRef}
								userFullname={userData.name + ' ' + userData.lastName}
								closeMenu={() => setMenuOpen(false)}
							/>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
