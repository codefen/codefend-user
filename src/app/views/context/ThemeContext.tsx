import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import createFastContext from './FastContextProvider';
import { useLocation } from 'react-router';
import { useUserRole } from '#commonUserHooks/useUserRole';

export type Theme = {
  theme: 'dark' | 'light';
  changeTheme: () => void;
};

const SITE_THEME_KEY = 'codefend-theme-mode';

/** Same resolution as the public site: auto follows a light color scheme, otherwise dark. */
export function resolveSiteTheme(): 'dark' | 'light' | null {
  let mode: string | null = null;
  try {
    mode = localStorage.getItem(SITE_THEME_KEY);
  } catch {
    return null;
  }
  if (mode === 'light' || mode === 'dark') return mode;
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return null;
}

export function getInitialTheme(): 'dark' | 'light' {
  const fromSite = resolveSiteTheme();
  if (fromSite) return fromSite;
  const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return storedTheme || (prefersLight ? 'light' : 'dark');
}

const initialThemeState = {
  theme: getInitialTheme(),
  changeTheme: () => {}, // se sobreescribe después
};

const { FastContextProvider: ThemeContextProvider, useFastField } =
  createFastContext<Theme>(initialThemeState);

export const useTheme = () => {
  const themeField = useFastField('theme');
  const { pathname } = useLocation();
  const { isAdmin, isProvider } = useUserRole();
  const hasUserAdmin = isAdmin() || isProvider();

  const toggleTheme = () => {
    const next = themeField.get === 'dark' ? 'light' : 'dark';
    themeField.set(next);
    try {
      localStorage.setItem(SITE_THEME_KEY, next);
    } catch {
      /* ignore private-mode storage failures */
    }
    if (pathname?.startsWith('/issues/') && hasUserAdmin) {
      window.location.reload();
    }
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
