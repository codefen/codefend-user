interface LogoPath {
  path: string;
}

interface LogoProps {
  theme: string;
  onClick?: () => void;
}

const themeToImage: Record<string, LogoPath> = {
  light: {
    path: '/codefend/logo-light.svg',
  },
  dark: {
    path: '/codefend/logo-dark.svg',
  },
  shadow: { path: '/codefend/logo-shadow.png' },
  inshadow: { path: '/codefend/logo-inshadow.png' },
  aim: { path: '/codefend/aim-light.svg' },
  aimColor: { path: '/codefend/fav.png' },
};

const Logo = ({ theme, onClick }: LogoProps) => {
  return (
    <div id="brand" className="brand-img" onClick={onClick}>
      <img src={themeToImage[theme].path} alt="Codefend Logo" decoding="async" loading="lazy" />
    </div>
  );
};

export default Logo;
