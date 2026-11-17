import { useShowScreen } from '#commonHooks/useShowScreen';
import { Navigate, Outlet } from 'react-router';
import { Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useUserData } from '#commonUserHooks/useUserData';
import { MoonIcon, SunIcon } from '@/app/views/components';
import { useTheme } from '@/app/views/context/ThemeContext';
import Show from '@/app/views/components/Show/Show';
import { AuthHeroMesh } from '@/app/views/pages/auth/AuthHeroMesh';

export const NewAuthPage = () => {
  const [showScreen] = useShowScreen();
  const { isAuth } = useUserData();
  const { changeTheme, theme } = useTheme();

  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  const themeToggle = createPortal(
    <button
      type="button"
      onClick={() => changeTheme()}
      className="theme-changer-button auth-theme-toggle"
      aria-label="Toggle color theme">
      <Show when={theme === 'dark'} fallback={<SunIcon width={1.75} height={1.75} />}>
        <MoonIcon width={1.75} height={1.75} />
      </Show>
    </button>,
    document.body
  );

  return (
    <main className={`auth-pages ${showScreen ? 'actived' : ''}`}>
      <AuthHeroMesh />
      {themeToggle}
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
};
