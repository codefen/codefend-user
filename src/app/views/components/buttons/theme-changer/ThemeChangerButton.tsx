import { MoonIcon, Show, SunIcon } from '../..';
import { useTheme } from '../../../ThemeContext';
import './themeChanger.scss';

export const ThemeChangerButton = () => {
	const { theme, changeTheme } = useTheme();

	return (
		<div
			
			title="Change theme"
			onClick={() => changeTheme()}>
			<Show
				when={theme === 'dark'}
				fallback={<SunIcon width={1.75} height={1.75} />}>
				<MoonIcon width={1.75} height={1.75} />
			</Show>
		</div>
	);
};
