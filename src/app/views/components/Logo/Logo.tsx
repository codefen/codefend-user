interface LogoPath {
  path: string;
}

interface LogoProps {
  theme: string;
  onClick?: () => void;
}

const asset = (file: string) => `${import.meta.env.BASE_URL}codefend/${file}`;

const themeToImage: Record<string, LogoPath> = {
  light: { path: asset('brand-new-light.svg') },
  dark: { path: asset('brand-new-dark.svg') },
  shadow: { path: asset('logo-shadow.png') },
  inshadow: { path: asset('logo-inshadow.png') },
  aim: { path: asset('aim-light.svg') },
  aimColor: { path: asset('brand-mark.svg') },
};

const Logo = ({ theme, onClick }: LogoProps) => {
  return (
    <div id="brand" className="brand-img" onClick={onClick}>
      <img src={themeToImage[theme].path} alt="Codefend" decoding="async" />
    </div>
  );
};

export default Logo;
