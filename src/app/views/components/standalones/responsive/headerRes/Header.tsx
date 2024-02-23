import React from 'react';
import { Logo, ThemeChangerButton } from '../../..';
import './Header.scss';
import { useTheme } from '../../../../ThemeContext';

const Header: React.FC = () => {
	const { theme } = useTheme();
	return (
		<header className="head">
			<section className="content">
				<div className='flex pt-3 max-w-[120px]'>
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
