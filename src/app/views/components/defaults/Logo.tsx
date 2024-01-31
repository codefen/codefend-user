import React from 'react';

interface Logo {
	path: string;
	styles: React.CSSProperties;
}

interface LogoProps {
	theme: string;
}

const Logo = ({ theme }: LogoProps) => {
	const themeToImage: Record<string, Logo> = {
		light: {
			path: '/codefend/logo-light.svg',
			styles: { width: '120px', height: '30px' },
		},
		dark: {
			path: '/codefend/logo-dark.svg',
			styles: { width: '200px', height: '30px' },
		},
		shadow: { path: '/codefend/logo-shadow.png', styles: {} },
		aim: { path: '/codefend/aim-light.svg', styles: { height: '30px' } },
	};

	const selectedLogo = themeToImage[theme] as Logo;

	return (
		<>
			<div id="brand" className="brand-img">
				<img
					src={selectedLogo.path}
					style={selectedLogo.styles}
					alt="Codefend Logo"
					loading="lazy"
				/>
			</div>
		</>
	);
};

export default Logo;
