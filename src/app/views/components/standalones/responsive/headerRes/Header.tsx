import React from 'react';
import { useAuthStore } from '../../../../../data';
import { ThemeChangerButton } from '../../..';
import './Header.scss'

const Header: React.FC = () => {
	const { userData } = useAuthStore();
	return (
		<header className='head'>
			<section className='content'>
				
      <span className="mail">{userData.email ?? 'not-found'}</span>
        
				<div>
					<ThemeChangerButton />
				</div>
			</section>
		</header>
	);
};

export default Header;
