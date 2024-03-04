import React from 'react';
import { Logo, MenuIcon, ThemeChangerButton } from '../../..';
import { usePanelStore } from '../../../../../data';
import { useTheme } from '../../../../ThemeContext';
import './Header.scss';

const Header: React.FC = () => {
	const { theme } = useTheme();
	const { open, handleChange } = usePanelStore();

	return (
		<header className="head">
			<section className="content">
				<button onClick={() => handleChange()}>
					<MenuIcon />
				</button>

				<div className="theme-changer">
					{theme === 'dark' ? (
						<Logo theme="light" />
					) : (
						<Logo theme="dark" />
					)}
				</div>

				<div>
					<ThemeChangerButton activeText={false} />
				</div>
			</section>
		</header>
	);
};

export default Header;
