import { Link } from 'react-router';
import css from './newheader.module.scss';
import {
  AdminCompanyIcon,
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
import Show from '@/app/components/Show/Show';
import { useTheme } from '@/app/views/context/ThemeContext';
import { useUserData } from '#commonUserHooks/useUserData';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useAdminCompanyStore from '@stores/adminCompany.store';

const verifyPath = (verifyPath: string, isRoot: boolean) => {
  const currentPath = window.location.pathname;
  if (currentPath === '/' && isRoot) return true;
  return currentPath.startsWith(verifyPath);
};

export const NewHeader = () => {
  const [baseApiName, _setBaseApiName] = useState('kundalini');
  const { theme, changeTheme } = useTheme();
  const { getUserdata } = useUserData();
  const userData = getUserdata();
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
  const { companies } = useAdminCompanyStore();

  const isNotProviderAndReseller = !isProvider() && !isReseller();

  const menuItems = useMemo(
    () => [
      {
        title: 'Admin Companies',
        id: 'sidebar_admin',
        icon: <AdminCompanyIcon />,
        to: '/companies',
        root: isAdmin(),
        haveAccess: isAdmin() || (isProvider() && companies.length > 0 && companies[0] !== null),
      },
      {
        title: 'Dashboard',
        id: 'sidebar_dashboard',
        icon: <ChartIcon />,
        to: '/dashboard',
        haveAccess: isNotProviderAndReseller,
        root: !isProvider() && !isReseller() && !isAdmin() && isNormalUser(),
      },
      {
        title: 'Resources',
        id: 'sidebar_resources',
        icon: <ChartIcon />,
        to: '/resources',
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
  console.log({ menuItems });
  return (
    <div className={css['headerContainer']}>
      <header className={css['header']}>
        <nav className={css['headerLeft']}>
          {menuItems.map(item =>
            item.haveAccess ? (
              <Link
                key={item.id}
                to={item.to}
                id={item.id}
                title={item.title}
                className={`${verifyPath(item.to, item?.root || false) ? css['active'] : ''}`}
                aria-label={item.title}>
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
