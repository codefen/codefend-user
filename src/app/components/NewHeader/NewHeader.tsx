import { Link, useNavigate } from 'react-router';
import css from './newheader.module.scss';
import {
  AdminCompanyIcon,
  BugIcon,
  ChartIcon,
  CodefendIcon,
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
import { ConfirmModal, ModalWrapper } from '@modals/index';
import useModal from '#commonHooks/useModal';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import useAuthStore from '@stores/auth.store';

const verifyPath = (verifyPath: string, isRoot: boolean) => {
  const currentPath = window.location.pathname;
  if (currentPath === '/' && isRoot) return true;
  return currentPath.startsWith(verifyPath);
};

export const NewHeader = () => {
  const [baseApiName, _setBaseApiName] = useState('kundalini');
  const { theme, changeTheme } = useTheme();
  const { getUserdata, logout } = useUserData();
  const userData = getUserdata();
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
  const { companies } = useAdminCompanyStore();
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();
  const { isAuth } = useAuthStore(state => state);

  const isNotProviderAndReseller = !isProvider() && !isReseller();
  const navigate = useNavigate();
  const menuItems = useMemo(
    () => [
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
        title: 'Resources',
        id: 'sidebar_resources',
        icon: <CodefendIcon className={css['codefendIcon']} />,
        to: isAuth ? '/resources' : '',
        haveAccess: true,
      },
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
    ],
    [isAuth, isAdmin, isProvider, isNotProviderAndReseller, isReseller, isNormalUser, companies]
  );
  return (
    <div className={css['headerContainer']}>
      <Show when={showModal && showModalStr === MODAL_KEY_OPEN.LOGOUT}>
        <ModalWrapper action={() => setShowModal(!showModal)}>
          <ConfirmModal
            header="ARE YOU SURE YOU WANT TO LOGOUT?"
            cancelText="Cancel"
            confirmText="Logout"
            close={() => setShowModal(!showModal)}
            action={() => {
              setShowModal(false);
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
          <button
            className={`${css['rightItem']} ${css['rightItemLogout']}`}
            onClick={() => {
              setShowModalStr(MODAL_KEY_OPEN.LOGOUT);
              setShowModal(true);
            }}>
            <LogoutIcon width={1.1} height={1.1} />
          </button>
        </div>
      </header>
    </div>
  );
};
