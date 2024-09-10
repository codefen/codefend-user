import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

export type Theme = {
  theme: 'dark' | 'light';
  changeTheme: () => void;
};

function getInitialTheme(): 'dark' | 'light' {
  const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return storedTheme || (prefersDarkMode ? 'dark' : 'light');
}

const ThemeContext = createContext({} as Theme);

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme());

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};
