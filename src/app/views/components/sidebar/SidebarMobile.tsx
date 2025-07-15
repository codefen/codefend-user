import { useUserData } from '#commonUserHooks/useUserData';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { ThemeChangerButton } from '@buttons/index';
import { LogoutIcon } from '@icons';
import { useEffect, useState } from 'react';
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
  const sidebarData = createSidebarData(isAdmin(), isProvider(), isReseller(), isNormalUser());

  const [activeSection, setActiveSection] = useState<MenuSection>(() =>
    getActiveSection(sidebarData)
  );
  const [activeItem, setActiveItem] = useState<string | null>(() =>
    getActiveItem(sidebarData[activeSection]?.items || [])
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserData();

  // Actualizar sección y item activos cuando cambie la ruta o se abra el sidebar
  useEffect(() => {
    if (isOpen) {
      const newActiveSection = getActiveSection(sidebarData);
      const newActiveItem = getActiveItem(sidebarData[newActiveSection]?.items || []);

      setActiveSection(newActiveSection);
      setActiveItem(newActiveItem);
    }
  }, [isOpen, sidebarData]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setAnimationClass('entering');

      // Mostrar contenido después de que inicie la animación
      const contentTimer = setTimeout(() => {
        setContentVisible(true);
      }, 150);

      return () => clearTimeout(contentTimer);
    }

    if (isAnimating && !isOpen) {
      setContentVisible(false);
      setAnimationClass('exiting');

      // Limpiar estado después de la animación de salida
      const exitTimer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationClass('');
      }, 400);

      return () => clearTimeout(exitTimer);
    }

    return () => {};
  }, [isOpen, isAnimating]);

  if (!isOpen && !isAnimating) return null;

  const handleSectionChange = (section: MenuSection) => {
    setContentVisible(false);
    setTimeout(() => {
      setActiveSection(section);
      // Actualizar item activo para la nueva sección
      const newActiveItem = getActiveItem(sidebarData[section]?.items || []);
      setActiveItem(newActiveItem);
      setContentVisible(true);
    }, 150);
  };

  const currentSectionItems = sidebarData[activeSection]?.items || [];

  return (
    <div
      className={`sidebar-mobile ${animationClass === 'entering' ? 'animate-slide-in' : ''} ${animationClass === 'exiting' ? 'animate-slide-out' : ''}`}>
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
