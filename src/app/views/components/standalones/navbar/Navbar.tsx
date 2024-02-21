import React, { lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumb, ThemeChangerButton } from '../..';
import { usePanelStore } from '../../../../data';
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
							className={`cursor-pointer duration-500 ${
								open && 'rotate-[360deg]'
							}`}>
							<Logo theme="aim" onClick={() => handleChange()} />
						</span>
					</div>
					<Breadcrumb
						root="Codefend"
						rootAction={() => navigate('/admin/company')}
					/>
				</div>

				<div className="right">
					<div className="change-theme">
						<ThemeChangerButton />
					</div>

					<div
						className="user"
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
			</nav>
		</>
	);
};

export default Navbar;
