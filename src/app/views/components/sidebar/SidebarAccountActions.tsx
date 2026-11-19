import { LogoutIcon, MoonIcon, SunIcon } from '@icons';
import { useTheme } from '@/app/views/context/ThemeContext';

export const SidebarAccountActions = ({ onSignOut }: { onSignOut: () => void }) => {
  const { theme, changeTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="company-sidebar-actions" role="group" aria-label="Panel controls">
      <button type="button" onClick={changeTheme}>
        {isLight ? <MoonIcon width={1} height={1} /> : <SunIcon width={1} height={1} />}
        {isLight ? 'Dark mode' : 'Light mode'}
      </button>
      <button type="button" onClick={onSignOut}>
        <LogoutIcon width={1} height={1} />
        Sign out
      </button>
    </div>
  );
};
