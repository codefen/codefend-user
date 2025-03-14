import { Link, useLocation, useNavigate } from 'react-router';
import css from './newheader.module.scss';
import {
  AdminCompanyIcon,
  BugIcon,
  ChartIcon,
  CLoudIcon,
  CodefendIcon,
  GlobeWebIcon,
  LanIcon,
  LogoutIcon,
  MessageIcon,
  MobileIcon,
  MoonIcon,
  NetworkIcon,
  PeopleGroupIcon,
  PreferenceIcon,
  SnbIcon,
  SourceCodeIcon,
  SunIcon,
} from '@icons';
import { useMemo, type ReactElement } from 'react';
import Show from '@/app/components/Show/Show';
import { useTheme } from '@/app/views/context/ThemeContext';
import { useUserData } from '#commonUserHooks/useUserData';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { ConfirmModal, ModalWrapper } from '@modals/index';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import useAuthStore from '@stores/auth.store';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import useModalStore from '@stores/modal.store';

interface MenuItemType {
  title: string;
  id: string;
  icon: ReactElement;
  to: string;
  root?: boolean;
  haveAccess: boolean;
}

const verifyPath = (verifyPath: string, isRoot: boolean) => {
  const currentPath = window.location.pathname;
  if (currentPath === '/' && isRoot) return true;
  return currentPath.startsWith(verifyPath);
};

export const NewHeader = () => {
  const { theme, changeTheme } = useTheme();
  const { getUserdata, logout } = useUserData();
  const userData = getUserdata();
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
  const { companies, companySelected } = useAdminCompanyStore();
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const location = useLocation();
  const { isAuth } = useAuthStore(state => state);
  const { scanStep, isScanRunning } = useWelcomeStore();
  const isProviderWithAccess =
    isProvider() &&
    companies.length > 0 &&
    companies[0] !== null &&
    companySelected?.id !== getUserdata().company_id;
  const isNotProviderAndReseller = !isProvider() && !isReseller();
  const navigate = useNavigate();
  const menuItems = useMemo(() => {
    const currentPath = location.pathname;
    const isResourcePage =
      currentPath.startsWith('/scope') ||
      currentPath.startsWith('/web') ||
      currentPath.startsWith('/cloud') ||
      currentPath.startsWith('/mobile') ||
      currentPath.startsWith('/network') ||
      currentPath.startsWith('/social') ||
      currentPath.startsWith('/source');

    const items = [
      {
        title: 'Admin Companies',
        id: 'sidebar_admin',
        icon: <AdminCompanyIcon />,
        to: isAuth ? '/companies' : '',
        root: isAdmin(),
        haveAccess: isAdmin() || (isProvider() && companies.length > 0 && companies[0] !== null),
      },
      {
        title: 'Dashboard',
        id: 'sidebar_dashboard',
        icon: <ChartIcon />,
        to: isAuth ? '/dashboard' : '',
        haveAccess: isNotProviderAndReseller,
        root: !isProvider() && !isReseller() && !isAdmin() && isNormalUser(),
      },
      {
        title: 'Scope',
        id: 'sidebar_resources',
        icon: <CodefendIcon className={css['codefendIcon']} />,
        to: isAuth ? '/scope' : '',
        haveAccess: true,
      },
      isResourcePage
        ? {
            title: 'Web',
            id: 'sidebar_web',
            icon: <GlobeWebIcon />,
            to: '/web',
            root: false,
            haveAccess: isNotProviderAndReseller || isProviderWithAccess,
          }
        : null,
      isResourcePage
        ? {
            title: 'Mobile',
            id: 'sidebar_mobile',
            icon: <MobileIcon />,
            to: '/mobile',
            root: false,
            haveAccess: isNotProviderAndReseller || isProviderWithAccess,
          }
        : null,
      isResourcePage
        ? {
            title: 'Cloud',
            id: 'sidebar_cloud',
            icon: <CLoudIcon />,
            to: '/cloud',
            root: false,
            haveAccess: isNotProviderAndReseller || isProviderWithAccess,
          }
        : null,
      isResourcePage
        ? {
            title: 'Social Engineering',
            id: 'sidebar_social',
            icon: <PeopleGroupIcon />,
            to: '/social',
            root: false,
            haveAccess: isNotProviderAndReseller || isProviderWithAccess,
          }
        : null,
      isResourcePage
        ? {
            title: 'Network',
            id: 'sidebar_net',
            icon: <LanIcon />,
            to: '/network',
            root: false,
            haveAccess: isNotProviderAndReseller || isProviderWithAccess,
          }
        : null,
      isResourcePage
        ? {
            title: 'Source Code',
            id: 'sidebar_source',
            icon: <SourceCodeIcon />,
            to: '/source',
            root: false,
            haveAccess: isNotProviderAndReseller || isProviderWithAccess,
          }
        : null,
      {
        title: 'Issues',
        id: 'sidebar_issues',
        icon: <BugIcon />,
        to: isAuth ? '/issues' : '',
        haveAccess: true,
      },
      {
        title: 'Customer Support',
        id: 'sidebar_support',
        icon: <MessageIcon />,
        to: isAuth ? '/cs' : '',
        haveAccess: true,
      },
      {
        title: 'Preferences',
        id: 'sidebar_preferences',
        icon: <PreferenceIcon />,
        to: isAuth ? '/preferences' : '',
        haveAccess: true,
      },
      {
        title: 'SNS',
        id: 'sidebar_sns',
        icon: <SnbIcon />,
        to: '/sns',
        root: false,
        haveAccess: !isReseller(),
      },
    ].filter((i): i is MenuItemType => i !== null);
    return items;
  }, [isAuth, isAdmin, isProvider, isNotProviderAndReseller, isReseller, isNormalUser, companies]);
  return (
    <div className={css['headerContainer']}>
      <Show when={isOpen && modalId === MODAL_KEY_OPEN.LOGOUT}>
        <ModalWrapper action={() => setIsOpen(false)}>
          <ConfirmModal
            header="ARE YOU SURE YOU WANT TO LOGOUT?"
            cancelText="Cancel"
            confirmText="Logout"
            close={() => setIsOpen(false)}
            action={() => {
              setIsOpen(false);
              logout();
              navigate('/auth/signin');
            }}
          />
        </ModalWrapper>
      </Show>
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
          <Show when={isScanRunning && modalId !== MODAL_KEY_OPEN.USER_WELCOME_FINISH}>
            <button
              className={css['rightItem']}
              onClick={() => {
                setIsOpen(true);
                setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
              }}>
              <img
                src="/codefend/loader_full_size.png"
                alt="loader"
                className={css['loader-animate-spin']}
                width={20}
                height={20}
              />
              <span className={css['step-text']}>{scanStep}/3</span>
            </button>
          </Show>
          <button className={css['rightItem']}>
            <NetworkIcon width={1.1} height={1.1} />
          </button>
          <div className={css['rightItem']}>
            <span className="email">{userData.email || 'not-found'}</span>
          </div>
          <button className={css['rightItem']} onClick={() => changeTheme()}>
            <Show when={theme === 'dark'} fallback={<SunIcon width={1.75} height={1.75} />}>
              <MoonIcon width={1.75} height={1.75} />
            </Show>
          </button>
          <button
            className={`${css['rightItem']} ${css['rightItemLogout']}`}
            onClick={() => {
              setModalId(MODAL_KEY_OPEN.LOGOUT);
              setIsOpen(true);
            }}>
            <LogoutIcon width={1.1} height={1.1} />
          </button>
        </div>
      </header>
    </div>
  );
};
