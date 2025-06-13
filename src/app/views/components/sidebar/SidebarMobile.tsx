import { useUserData } from '#commonUserHooks/useUserData';
import { LogoutIcon } from '@icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

type MenuSection = 'Main' | 'Attack surface' | 'Risk control';

const sidebarData = {
  Main: ['Dashboard', 'Team members', 'Orders and payments', 'User profile'],
  'Attack surface': ['Web software', 'Mobile software', 'Network infrastructure', 'Social attacks'],
  'Risk control': ['Detected issues', 'Launch AI scan', 'Dataleaks explorer', 'Ask a hacker'],
};

const menuItemsPaths = {
  Dashboard: '/dashboard',
  'Team members': '/team-members',
  'Orders and payments': '/orders-payments',
  'User profile': '/user-profile',
  'Web software': '/web-software',
  'Mobile software': '/mobile-software',
  'Network infrastructure': '/network-infrastructure',
  'Detected issues': '/issues',
  'Launch AI scan': '/automated-web-scans',
  'Dataleaks explorer': '/sns',
  'Ask a hacker': '/ask-a-hacker',
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
  const [activeSection, setActiveSection] = useState<MenuSection>('Main');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserData();

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
      setContentVisible(true);
    }, 150);
  };

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
            {sidebarData[activeSection].map(item => (
              <button
                key={`${activeSection}-${item}`}
                className={`menu-item no-border ${activeItem === item ? 'active' : ''}`}
                onClick={() => {
                  closeSidebar();
                  navigate(menuItemsPaths[item as keyof typeof menuItemsPaths]);
                  setActiveItem(item);
                }}>
                {item}
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

            <button className="no-border no-outline sidebar-footer-logout" onClick={logout}>
              <LogoutIcon width={1.1} height={1.1} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
