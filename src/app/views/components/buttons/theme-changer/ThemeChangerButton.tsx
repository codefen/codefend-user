import { type FC } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import './themeChanger.scss';
import Show from '@/app/views/components/Show/Show';
import { MoonIcon, SunIcon } from '@icons';

export const ThemeChangerButton: FC<{ activeText?: boolean }> = ({ activeText }: any) => {
  const { theme, changeTheme } = useTheme();

  return (
    <div title="Change theme" onClick={() => changeTheme()} className="action">
      <Show when={theme === 'dark'} fallback={<SunIcon width={1.75} height={1.75} />}>
        <MoonIcon width={1.75} height={1.75} />
      </Show>
    </div>
  );
};
