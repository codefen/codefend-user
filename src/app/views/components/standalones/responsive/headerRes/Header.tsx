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
				<button className='rounded-full hover:bg-slate-400' onClick={() => handleChange()}>
					<MenuIcon />
				</button>

				<div className="flex pt-1 max-w-[120px]">
					{theme === 'dark' ? (
						<Logo theme="light" />
					) : (
						<Logo theme="dark" />
					)}
				</div>

				<div>
					<ThemeChangerButton />
				</div>
			</section>
		</header>
	);
};

export default Header;
