import React from 'react';
import { MoonIcon, Show, SunIcon } from '../..';
import './themeChanger.scss';
import { useTheme } from '../../../ThemeContext';

export const ThemeChangerButton = () => {
	const { theme, changeTheme } = useTheme();

	return (
		<button
			className={`theme`}
			title="Change theme"
			onClick={() => changeTheme()}>
			<Show
				when={theme === 'dark'}
				fallback={<SunIcon width={1.75} height={1.75} />}>
				<MoonIcon width={1.75} height={1.75} />
			</Show>
		</button>
	);
};
