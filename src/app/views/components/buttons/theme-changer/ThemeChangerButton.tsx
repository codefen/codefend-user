import { type FC } from 'react';
import { MoonIcon, Show, SunIcon } from '../..';
import { useTheme } from '../../../ThemeContext';
import './themeChanger.scss';

export const ThemeChangerButton: FC<{ activeText?: boolean }> = ({
	activeText,
}: any) => {
	const { theme, changeTheme } = useTheme();

	const text = activeText ? 'Theme' : '';
	return (
		<div
			title="Change theme"
			onClick={() => changeTheme()}
			className="action">
			<Show
				when={theme === 'dark'}
				fallback={<SunIcon width={1.75} height={1.75} />}>
				<MoonIcon width={1.75} height={1.75} />
			</Show>
		</div>
	);
};
