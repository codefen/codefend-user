import { useCallback, type ReactNode } from 'react';
import {
  BugIcon,
  AdminCompanyIcon,
  ChartIcon,
  GlobeWebIcon,
  ProfileIcon,
  WorksIcon,
  LeadIcon,
  UsersIcon,
  PeopleIconOutline,
  UsersGroupOutline,
  CreditCardIcon,
  GridOutlineIcon,
  SocialOutlineIcons,
  DataleakSearchIcon,
  AskQuestionOutlineIcon,
  DeviceSearchIcon,
  NetworkOutlineIcon,
} from '@icons';
import { LightningIcon } from '../icons/LightningIcon';
import { SidebarItem } from '@/app/views/components/sidebar/SidebarItem';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { verifyPath } from '@/app/views/components/sidebar/Sidebar';
import { lazy, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogoutIcon, NetworkIcon, RobotFaceIcon } from '@icons';
import Show from '@/app/views/components/Show/Show.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import useModal from '#commonHooks/useModal.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import useModalStore from '@stores/modal.store.ts';
import { Breadcrumb } from '@/app/views/components/utils/Breadcrumb.tsx';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import { ThemeChangerButton } from '@buttons/index.ts';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { useTheme } from '@/app/views/context/ThemeContext';
import { SunIcon, MoonIcon } from '@icons';

const Logo = lazy(() => import('../Logo/Logo.tsx'));

// Icono de flecha para colapsar
const CollapseArrow = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className={`sidebar-group-arrow ${isCollapsed ? 'collapsed' : ''}`}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const SidebarDesktop = ({
  companies,
  isProviderWithAccess,
  isAuth,
}: {
  companies: any;
  isProviderWithAccess: boolean;
  isAuth: boolean;
}) => {
  const navigate = useNavigate();
  const { logout, getUserdata } = useUserData();
  const userData = getUserdata();
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
  // const [isMenuOpen, setMenuOpen] = useState(false);
  // const dropdownRef = useRef<HTMLDivElement>(null);
  // const userRef = useRef<HTMLDivElement>(null);
  const isOpenNetworkSetting = useGlobalFastField('isOpenNetworkSetting');
  // const [baseApiName, setBaseApiName] = useState('');
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();
  const { setIsOpen, setModalId } = useModalStore();
  const isProgressStarted = useGlobalFastField('isProgressStarted');
  const progress = useGlobalFastField('scanProgress');
  const { theme, changeTheme } = useTheme();
  // const isDark = theme === 'dark';

  // Estado para manejar qué secciones están colapsadas
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Función para alternar el colapso de una sección
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const rootAction = () => {
    navigate('/');
  };
  const openGuide = () => {
    setModalId(MODAL_KEY_OPEN.USER_WELCOME);
    setIsOpen(true);
  };


  const isNotProviderAndReseller = !isProvider() && !isReseller();

  const newMenuItems = [
    {
      type: 'group',
      title: 'Admin',
      id: 'sidebar_admin',
      children: [
        {
          title: 'Admin Commander',
          id: 'sidebar_commander',
          icon: <LightningIcon isVisible />,
          to: '/admin/commander',
          root: false,
          haveAccess: isAdmin(),
        },
      ],
      haveAccess: isAdmin(),
    },
    {
      type: 'group',
      title: 'Main',
      id: 'sidebar_mainitems',
      children: [
        {
          title: 'My profile',
          id: 'sidebar_profile',
          icon: <ProfileIcon isVisible />,
          to: '/provider/profile',
          root: isProvider(),
          haveAccess: isProvider(),
        },
        {
          title: 'Orders',
          id: 'sidebar_orders',
          icon: <WorksIcon isVisible />,
          to: '/provider/orders',
          root: false,
          haveAccess: isProvider(),
        },
        {
          title: 'Leads',
          id: 'sidebar_r_leads',
          icon: <LeadIcon isVisible />,
          to: '/reseller/leads',
          root: isReseller(),
          haveAccess: isReseller(),
        },
        {
          title: 'Users',
          id: 'sidebar_r_users',
          icon: <UsersIcon isVisible />,
          to: '/reseller/users',
          root: false,
          haveAccess: isReseller(),
        },
        {
          title: 'Company',
          id: 'sidebar_r_company',
          icon: <AdminCompanyIcon />,
          to: '/reseller/companies',
          root: false,
          haveAccess: isReseller(),
        },
        {
          title: 'Orders',
          id: 'sidebar_r_orders',
          icon: <ChartIcon />,
          to: '/reseller/orders',
          root: false,
          haveAccess: isReseller(),
        },
        {
          title: 'Dashboard',
          id: 'sidebar_dashboard',
          icon: <GridOutlineIcon />,
          to: '/dashboard',
          root: !isProvider() && !isReseller() && !isAdmin() && isNormalUser(),
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'Team members',
          id: 'sidebar_team_members',
          icon: <UsersGroupOutline />,
          to: '/team-members',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'User profile',
          id: 'sidebar_user_profile',
          icon: <PeopleIconOutline />,
          to: '/user-profile',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'Purchases',
          id: 'sidebar_orders_payments',
          icon: <CreditCardIcon />,
          to: '/orders-payments',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },
      ],
    },
    {
      type: 'group',
      title: 'Attack surface',
      id: 'sidebar_tools',
      children: [
        {
          title: 'Web software',
          id: 'sidebar_web',
          icon: <GlobeWebIcon />,
          to: '/web',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'Network devices',
          id: 'sidebar_net',
          icon: <NetworkOutlineIcon />,
          to: '/network',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'Social attacks',
          id: 'sidebar_social',
          icon: <SocialOutlineIcons />,
          to: '/social',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        /* SECCIÓN MOBILE SOFTWARE TEMPORALMENTE OCULTA
        {
          title: 'Mobile software',
          id: 'sidebar_mobile',
          icon: <MobileIcon />,
          to: '/mobile',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        */
      ],
    },
    {
      type: 'group',
      title: 'Risk control',
      id: 'sidebar_vulnerabilities',
      children: [
        {
          title: 'Detected issues',
          id: 'sidebar_issues',
          icon: <BugIcon />,
          to: '/issues',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'AI Surveillance',
          id: 'sidebar_ai_surveillance',
          to: '/ai-surveillance',
          root: false,
          icon: <DeviceSearchIcon />,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'Dataleaks explorer',
          id: 'sidebar_sns',
          icon: <DataleakSearchIcon />,
          to: '/sns',
          root: false,
          haveAccess: !isReseller(),
        },
        {
          title: 'Ask a hacker',
          id: 'sidebar_talk_to_hacker',
          icon: <AskQuestionOutlineIcon />,
          to: '/ask-a-hacker',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
      ],
    },
  ];

  const getItems = useCallback(
    (menu: any[]) => {
      const items: ReactNode[] = [];

      for (const entry of menu) {
        if (entry.type === 'group') {
          const groupChildren = entry.children.filter((child: any) => child.haveAccess);
          if (groupChildren.length > 0) {
            const isCollapsed = collapsedSections.has(entry.id);
            items.push(
              <div key={`group-${entry.id}`} className="sidebar-group">
                <div
                  className="sidebar-group-title-container"
                  onClick={() => toggleSection(entry.id)}>
                  <div className="sidebar-group-title">{entry.title}</div>
                  <CollapseArrow isCollapsed={isCollapsed} />
                </div>
                <div className={`sidebar-group-content ${isCollapsed ? 'collapsed' : ''}`}>
                  {groupChildren.map(({ id, title, icon, to, root, onClick }: any) => (
                    <SidebarItem
                      key={`sb-${id}`}
                      id={id}
                      title={title}
                      icon={icon}
                      to={to}
                      isActive={verifyPath(to, root)}
                      isAuth={isAuth}
                      onClick={onClick}
                    />
                  ))}
                </div>
              </div>
            );
          }
        } else {
          const { id, haveAccess, title, icon, to, root } = entry;
          if (haveAccess) {
            items.push(
              <SidebarItem
                key={`sb-${id}`}
                id={id}
                title={title}
                icon={icon}
                to={to}
                isActive={verifyPath(to, root)}
                isAuth={isAuth}
              />
            );
          }
        }
      }

      return items;
    },
    [collapsedSections, toggleSection]
  );

  return (
    <>
      <Show when={showModal && showModalStr === MODAL_KEY_OPEN.LOGOUT}>
        <ModalWrapper action={() => setShowModal(!showModal)}>
          <ConfirmModal
            header="ARE YOU SURE YOU WANT TO LOGOUT?"
            cancelText="Cancel"
            confirmText="Logout"
            close={() => setShowModal(!showModal)}
            action={() => {
              logout();
            }}
          />
        </ModalWrapper>
      </Show>
      {isAdmin() && (
        <NetworkSettingModal
          close={() => isOpenNetworkSetting.set(!isOpenNetworkSetting.get)}
          isOpen={isOpenNetworkSetting.get}
        />
      )}
      {/* LOGO Y TEXTO ARRIBA DE TODO */}
      <div className="sidebar-logo-block" onClick={openGuide}>
        <span className="aim-logo">
          <Logo theme="aimColor" />
        </span>
        <span className="sidebar-logo-title">codefend</span>
      </div>
      {/* MENÚS */}
      {getItems(newMenuItems)}
      {/* HR y acciones rápidas debajo de Risk control */}
      <hr style={{ margin: '18px 0 10px 0', border: 0, borderTop: '1px solid #e0e0e0' }} />
      {/* Agrupo theme y logout en un sidebar-group sin título */}
      <div className="sidebar-group">
        <SidebarItem
          id="sidebar_action_theme"
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          icon={
            theme === 'light' ? <MoonIcon width={1} height={1} /> : <SunIcon width={1} height={1} />
          }
          to="#"
          isActive={false}
          isAuth={isAuth}
          onClick={changeTheme}
        />
        <SidebarItem
          id="sidebar_action_logout"
          title="Close session"
          icon={<LogoutIcon width={1} height={1} />}
          to="#"
          isActive={false}
          isAuth={isAuth}
          onClick={() => {
            setShowModalStr(MODAL_KEY_OPEN.LOGOUT);
            setShowModal(true);
          }}
        />
      </div>
    </>
  );
};
