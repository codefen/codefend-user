import { useState } from 'react';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { SidebarDesktop } from '@/app/views/components/sidebar/SidebarDesktop';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from '@/app/views/components/sidebar/SidebarMobile';
import { SidebarOpenButton } from '@/app/views/components/sidebar/SidebarOpenButton';
import './sidebar.scss';

export const verifyPath = (verifyPath: string, isRoot: boolean) => {
  const currentPath = window.location.pathname;
  if (currentPath === '/' && isRoot) return true;
  return currentPath.startsWith(verifyPath);
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getUserdata, company, isAuth } = useUserData();
  const { isProvider } = useUserRole();
  const companies = useGlobalFastField('companies');
  const matches = useMediaQuery('(min-width: 1180px)');

  const isProviderWithAccess =
    isProvider() &&
    companies.get?.length > 0 &&
    companies.get?.[0] !== null &&
    company.get?.id !== getUserdata()?.company_id;

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <aside
      className={`sidebar ${matches ? 'desktop-active' : 'mobile-active'} ${isOpen ? 'sidebar-open' : ''}`}>
      <SidebarOpenButton isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`sidebar-blur ${isOpen ? 'blur-enter animate-overlay-in' : ''}`}
        onDoubleClick={closeSidebar}></div>
      {matches ? (
        <SidebarDesktop
          companies={companies}
          isAuth={isAuth}
          isProviderWithAccess={isProviderWithAccess}
        />
      ) : (
        <SidebarMobile
          isOpen={isOpen}
          closeSidebar={closeSidebar}
          email={getUserdata()?.email || 'example@gmail.com'}
          companyName={company.get?.name || 'Codefend'}
        />
      )}
    </aside>
  );
};

export default Sidebar;
