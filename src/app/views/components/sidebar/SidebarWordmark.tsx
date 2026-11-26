import { AimIcon } from '@icons';
import { useTheme } from '@/app/views/context/ThemeContext';

export const SidebarWordmark = ({ compact = false }: { compact?: boolean }) => {
  const { theme } = useTheme();

  if (compact) {
    return (
      <span className="sidebar-wordmark sidebar-wordmark--mark" aria-hidden="true">
        <AimIcon />
      </span>
    );
  }

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
