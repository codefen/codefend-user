import { PropsWithChildren, createContext, useContext, useState } from 'react';

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
	let preferedUserTheme: 'dark' | 'light' = 'light'; //Default is light
	if (localStorage.getItem('theme') !== null) {
		preferedUserTheme = localStorage.getItem('theme') as 'dark' | 'light';
	} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		preferedUserTheme = 'dark'; //If the browser prefers dark mode, apply it
	}

	const [theme, setTheme] = useState<'dark' | 'light'>(preferedUserTheme);
	localStorage.setItem('theme', theme);
	document.body.setAttribute('data-theme', theme);
	const changeTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', newTheme);
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
