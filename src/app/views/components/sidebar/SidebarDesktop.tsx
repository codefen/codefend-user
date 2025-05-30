import { useCallback, type ReactNode } from 'react';
import {
  BugIcon,
  AdminCompanyIcon,
  ChartIcon,
  GlobeWebIcon,
  MobileIcon,
  PeopleGroupIcon,
  SnbIcon,
  ProfileIcon,
  LanIcon,
  WorksIcon,
  LeadIcon,
  UsersIcon,
  ScanIcon,
} from '@icons';
import { SidebarItem } from '@/app/views/components/sidebar/SidebarItem';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { verifyPath } from '@/app/views/components/sidebar/Sidebar';

export const SidebarDesktop = ({
  companies,
  isProviderWithAccess,
  isAuth,
}: {
  companies: any;
  isProviderWithAccess: boolean;
  isAuth: boolean;
}) => {
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();

  const isNotProviderAndReseller = !isProvider() && !isReseller();

  const newMenuItems = [
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
          title: 'Company Panel',
          id: 'sidebar_company',
          icon: <AdminCompanyIcon />,
          to: '/admin/company',
          root: isAdmin(),
          haveAccess:
            isAdmin() || (isProvider() && companies.get?.length > 0 && companies.get?.[0] !== null),
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
          icon: <ChartIcon />,
          to: '/dashboard',
          root: !isProvider() && !isReseller() && !isAdmin() && isNormalUser(),
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'Team members',
          id: 'sidebar_team_members',
          icon: <></>,
          to: '/team-members',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'User profile',
          id: 'sidebar_user_profile',
          icon: <></>,
          to: '/user-profile',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'Orders and Payments',
          id: 'sidebar_orders_payments',
          icon: <></>,
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
          title: 'Mobile software',
          id: 'sidebar_mobile',
          icon: <MobileIcon />,
          to: '/mobile',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'Network infrastructure',
          id: 'sidebar_net',
          icon: <LanIcon />,
          to: '/network',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        /*{
          title: 'Cloud',
          id: 'sidebar_cloud',
          icon: <CLoudIcon />,
          to: '/cloud',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'Source Code',
          id: 'sidebar_source',
          icon: <SourceCodeIcon />,
          to: '/source',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        }, */
        {
          title: 'Social attacks',
          id: 'sidebar_social',
          icon: <PeopleGroupIcon />,
          to: '/social',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
      ],
    },
    {
      type: 'group',
      title: 'Vulnerabilities',
      id: 'sidebar_vulnerabilities',
      children: [
        {
          title: 'Issues',
          id: 'sidebar_issues',
          icon: <BugIcon />,
          to: '/issues',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
      ],
    },
    {
      type: 'group',
      title: 'Toolset',
      id: 'sidebar_toolset',
      children: [
        {
          title: 'Automated web scans',
          id: 'sidebar_scans',
          to: '/scans',
          root: false,
          icon: <ScanIcon size="1em" />,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
        {
          title: 'Dataleaks explorer',
          id: 'sidebar_sns',
          icon: <SnbIcon />,
          to: '/sns',
          root: false,
          haveAccess: !isReseller(),
        },
        /*{
          title: 'EPM',
          id: 'sidebar_epm',
          icon: <EnpIcon />,
          to: '/enp',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },
        {
          title: 'Vdb',
          id: 'sidebar_vdb',
          icon: <VdbIcon />,
          to: '/vdb',
          root: false,
          haveAccess: isNotProviderAndReseller,
        },*/
        {
          title: 'Ask a hacker',
          id: 'sidebar_talk_to_hacker',
          icon: <></>,
          to: '/ask-a-hacker',
          root: false,
          haveAccess: isNotProviderAndReseller || isProviderWithAccess,
        },
      ],
    },
  ];

  const getItems = useCallback((menu: any[]) => {
    const items: ReactNode[] = [];

    for (const entry of menu) {
      if (entry.type === 'group') {
        const groupChildren = entry.children.filter((child: any) => child.haveAccess);
        if (groupChildren.length > 0) {
          items.push(
            <div key={`group-${entry.id}`} className="sidebar-group">
              <div className="sidebar-group-title">{entry.title}</div>
              {groupChildren.map(({ id, title, icon, to, root }: any) => (
                <SidebarItem
                  key={`sb-${id}`}
                  id={id}
                  title={title}
                  icon={icon}
                  to={to}
                  isActive={verifyPath(to, root)}
                  isAuth={isAuth}
                />
              ))}
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
  }, []);

  return getItems(newMenuItems);
};
