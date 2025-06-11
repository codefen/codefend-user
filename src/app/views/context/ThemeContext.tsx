import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import createFastContext from './FastContextProvider';

export type Theme = {
  theme: 'dark' | 'light';
  changeTheme: () => void;
};

export function getInitialTheme(): 'dark' | 'light' {
  const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return storedTheme || (prefersDarkMode ? 'dark' : 'light');
}

const initialThemeState = {
  theme: getInitialTheme(),
  changeTheme: () => {}, // se sobreescribe después
};

const { FastContextProvider: ThemeContextProvider, useFastField } =
  createFastContext<Theme>(initialThemeState);

export const useTheme = () => {
  const themeField = useFastField('theme');
  const toggleTheme = () => {
    themeField.set(themeField.get === 'dark' ? 'light' : 'dark');
  };

  return {
    theme: themeField.get,
    changeTheme: toggleTheme,
  };
};

const ThemeUpdater = () => {
  const themeField = useFastField('theme');

  useEffect(() => {
    localStorage.setItem('theme', themeField.get);
    document.body.setAttribute('data-theme', themeField.get);
  }, [themeField.get]);

  return null;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeContextProvider>
      <ThemeUpdater />
      {children}
    </ThemeContextProvider>
  );
};
