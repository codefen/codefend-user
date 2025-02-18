import { Link } from 'react-router';
import css from './newheader.module.scss';
import {
  BugIcon,
  ChartIcon,
  LogoutIcon,
  MessageIcon,
  MoonIcon,
  NetworkIcon,
  PreferenceIcon,
  SunIcon,
} from '@icons';
import { useMemo, useState } from 'react';
import Show from '@defaults/Show';
import { useTheme } from '@/app/views/context/ThemeContext';
import { useUserData } from '#commonUserHooks/useUserData';

export const NewHeader = () => {
  const [baseApiName, _setBaseApiName] = useState('kundalini');
  const { theme, changeTheme } = useTheme();
  const { getUserdata } = useUserData();
  const userData = getUserdata();

  const menuItems = useMemo(
    () => [
      {
        title: 'Dashboard',
        id: 'sidebar_dashboard',
        icon: <ChartIcon />,
        to: '/',
        haveAccess: true,
      },
      {
        title: 'Resources',
        id: 'sidebar_dashboard',
        icon: <ChartIcon />,
        to: '/',
        haveAccess: true,
      },
      {
        title: 'Issues',
        id: 'sidebar_issues',
        icon: <BugIcon />,
        to: '/issues',
        haveAccess: true,
      },
      {
        title: 'Customer Support',
        id: 'sidebar_support',
        icon: <MessageIcon />,
        to: '/cs',
        haveAccess: true,
      },
      {
        title: 'Preferences',
        id: 'sidebar_preferences',
        icon: <PreferenceIcon />,
        to: '/preferences',
        haveAccess: true,
      },
    ],
    []
  );
  return (
    <div className={css['headerContainer']}>
      <header className={css['header']}>
        <nav className={css['headerLeft']}>
          {menuItems.map(item =>
            item.haveAccess ? (
              <Link to={item.to} id={item.id} title={item.title} aria-label={item.title}>
                {item.icon}
              </Link>
            ) : null
          )}
        </nav>
        <div className={css['headerRight']}>
          <button className={css['rightItem']}>
            <NetworkIcon width={1.1} height={1.1} />
            <span>{baseApiName}</span>
          </button>
          <div className={css['rightItem']}>
            <span className="email">{userData.email || 'not-found'}</span>
          </div>
          <button className={css['rightItem']} onClick={() => changeTheme()}>
            <Show when={theme === 'dark'} fallback={<SunIcon width={1.75} height={1.75} />}>
              <MoonIcon width={1.75} height={1.75} />
            </Show>
          </button>
          <button className={`${css['rightItem']} ${css['rightItemLogout']}`}>
            <LogoutIcon width={1.1} height={1.1} />
          </button>
        </div>
      </header>
    </div>
  );
};
