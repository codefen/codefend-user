import { useUserData } from '#commonUserHooks/useUserData';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { ThemeChangerButton } from '@buttons/index';
import { LogoutIcon } from '@icons';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { verifyPath } from '@/app/views/components/sidebar/Sidebar';

type MenuSection = 'Main' | 'Attack surface' | 'Risk control';

// Estructura de datos similar al desktop pero adaptada para mobile
const createSidebarData = (
  isAdmin: boolean,
  isProvider: boolean,
  isReseller: boolean,
  isNormalUser: boolean
) => {
  const isNotProviderAndReseller = !isProvider && !isReseller;

  return {
    Main: {
      items: [
        // Admin items
        ...(isAdmin
          ? [
              { title: 'Administration', path: '/admin/admin-section', root: false },
      { title: 'Landers Monitor', path: '/admin/landers', root: false },
      { title: 'Admin Commander', path: '/admin/commander', root: false },
              { title: 'Company Panel', path: '/admin/company', root: isAdmin },
            ]
          : []),

        // Provider items
        ...(isProvider
          ? [
              { title: 'My profile', path: '/provider/profile', root: isProvider },
              { title: 'Orders', path: '/provider/orders', root: false },
            ]
          : []),

        // Reseller items
        ...(isReseller
          ? [
              { title: 'Leads', path: '/reseller/leads', root: isReseller },
              { title: 'Users', path: '/reseller/users', root: false },
              { title: 'Company', path: '/reseller/companies', root: false },
              { title: 'Orders', path: '/reseller/orders', root: false },
            ]
          : []),

        // Normal user items
        ...(isNotProviderAndReseller
          ? [
              {
                title: 'Dashboard',
                path: '/dashboard',
                root: !isProvider && !isReseller && !isAdmin && isNormalUser,
              },
              { title: 'Team members', path: '/team-members', root: false },
              { title: 'Purchases', path: '/orders-payments', root: false },
              { title: 'User profile', path: '/user-profile', root: false },
            ]
          : []),
      ],
    },
    'Attack surface': {
      items: [
        { title: 'Web software', path: '/web', root: false },
        { title: 'Network devices', path: '/network', root: false },
        { title: 'Social attacks', path: '/social', root: false },
      ],
    },
    'Risk control': {
      items: [
        { title: 'Detected issues', path: '/issues', root: false },
        { title: 'AI Surveillance', path: '/ai-surveillance', root: false },
        { title: 'Dataleaks explorer', path: '/sns', root: false },
        { title: 'Ask a hacker', path: '/ask-a-hacker', root: false },
      ],
    },
  };
};

// Función para determinar qué sección debe estar activa
const getActiveSection = (sidebarData: any): MenuSection => {
  const currentPath = window.location.pathname;

  // Buscar en cada sección si algún item está activo
  for (const [sectionName, sectionData] of Object.entries(sidebarData)) {
    const section = sectionData as { items: Array<{ title: string; path: string; root: boolean }> };

    for (const item of section.items) {
      if (verifyPath(item.path, item.root)) {
        return sectionName as MenuSection;
      }
    }
  }

  // Si no se encuentra nada activo, retornar 'Main' como default
  return 'Main';
};

// Función para determinar qué item debe estar activo en una sección
const getActiveItem = (
  sectionItems: Array<{ title: string; path: string; root: boolean }>
): string | null => {
  for (const item of sectionItems) {
    if (verifyPath(item.path, item.root)) {
      return item.title;
    }
  }
  return null;
};

export const SidebarMobile = ({
  isOpen,
  closeSidebar,
  email,
  companyName,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
  email: string;
  companyName: string;
}) => {
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();

  // Memoizar sidebarData para evitar recreación constante
  const sidebarData = useMemo(
    () => createSidebarData(isAdmin(), isProvider(), isReseller(), isNormalUser()),
    [isAdmin, isProvider, isReseller, isNormalUser]
  );

  const [activeSection, setActiveSection] = useState<MenuSection>('Main');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserData();

  // Solo inicializar la sección activa cuando se abre el sidebar por primera vez
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const newActiveSection = getActiveSection(sidebarData);
      const newActiveItem = getActiveItem(sidebarData[newActiveSection]?.items || []);

      setActiveSection(newActiveSection);
      setActiveItem(newActiveItem);
      setHasInitialized(true);
    }

    // Reset cuando se cierra el sidebar
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen, sidebarData, hasInitialized]);

  // Mostrar contenido cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [isOpen]);

  // Siempre renderizar el componente, pero controlar visibilidad con CSS

  const handleSectionChange = (section: MenuSection) => {
    setActiveSection(section);
    // Actualizar item activo para la nueva sección
    const newActiveItem = getActiveItem(sidebarData[section]?.items || []);
    setActiveItem(newActiveItem);
  };

  const currentSectionItems = sidebarData[activeSection]?.items || [];

  return (
    <div
      className={`sidebar-mobile ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-mobile-header">
        <div className="sidebar-header-title"></div>
        <div className={`sidebar-tabs ${contentVisible ? 'visible' : ''}`}>
          <div className="sidebar-tab-container">
            {Object.keys(sidebarData).map(section => (
              <button
                key={section}
                onClick={() => handleSectionChange(section as MenuSection)}
                className={`tab-button no-border ${activeSection === section ? 'active' : ''}`}>
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-mobile-content">
        <div className={`sidebar-content-container ${contentVisible ? 'visible' : ''}`}>
          <h3>{activeSection}</h3>
          <div className="sidebar-content-items">
            {currentSectionItems.map(item => (
              <button
                key={`${activeSection}-${item.title}`}
                className={`menu-item no-border ${activeItem === item.title ? 'active' : ''}`}
                onClick={() => {
                  closeSidebar();
                  navigate(item.path);
                  setActiveItem(item.title);
                }}>
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-mobile-footer">
        <div className={`sidebar-footer-content ${contentVisible ? 'visible' : ''}`}>
          <div className="sidebar-footer-content-container">
            <div className="sidebar-footer-user">
              <span className="user-email">{email}</span>
              <span className="user-company">{companyName}</span>
            </div>
            <div className="sidebar-footer-actions">
              <ThemeChangerButton className="sidebar-footer-theme-changer" text="Theme" />
              <button className="no-border no-outline sidebar-footer-logout" onClick={logout}>
                <LogoutIcon width={1.1} height={1.1} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
