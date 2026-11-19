import { useTheme } from '@/app/views/context/ThemeContext';

export const SidebarWordmark = () => {
  const { theme } = useTheme();

  return (
    <img
      className="sidebar-wordmark"
      src={`${import.meta.env.BASE_URL}codefend/wordmark-on-${theme}.svg`}
      width={154}
      height={23}
      alt="Codefend"
    />
  );
};
