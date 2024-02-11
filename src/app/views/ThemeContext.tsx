import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { TiFlowChildren } from 'react-icons/ti';

export type Theme = {
	theme: 'dark' | 'light';
	changeTheme: () => void;
};

const ThemeContext = createContext({} as Theme);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	return { theme: context.theme, changeTheme: context.changeTheme };
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const preferedUserTheme =
		localStorage.getItem('theme') ||
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	const [theme, setTheme] = useState<'dark' | 'light'>(
		preferedUserTheme ?? 'light',
	);

	const changeTheme = () => {
		localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			<div
				style={{ width: '100%', height: '100%', position: 'relative' }}
				data-theme={theme}>
				{children}
			</div>
		</ThemeContext.Provider>
	);
};
