interface Logo {
	path: string;
}

interface LogoProps {
	theme: string;
	onClick?: () => void;
}

const Logo = ({ theme, onClick }: LogoProps) => {
	const themeToImage: Record<string, Logo> = {
		light: {
			path: '/codefend/logo-light.svg',
		},
		dark: {
			path: '/codefend/logo-dark.svg',
		},
		shadow: { path: '/codefend/logo-shadow.png' },
		aim: { path: '/codefend/aim-light.svg' },
		aimColor: { path: '/codefend/pentest-header-vector.svg' },
	};

	const selectedLogo = themeToImage[theme] as Logo;

	return (
		<div id="brand" className="brand-img" onClick={onClick}>
			<img src={selectedLogo.path} alt="Codefend Logo" loading="lazy" />
		</div>
	);
};

export default Logo;
