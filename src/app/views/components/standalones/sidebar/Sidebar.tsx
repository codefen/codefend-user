import { type FC, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
	BugIcon,
	AdminCompanyIcon,
	CLoudIcon,
	ChartIcon,
	EnpIcon,
	GlobeWebIcon,
	InxIcon,
	MobileIcon,
	PeopleGroupIcon,
	SnbIcon,
	VdbIcon,
	SourceCodeIcon,
	ProfileIcon,
	PreferenceIcon,
	MessageIcon,
	ProviderOrdersIcon,
	LanIcon,
	WorksIcon,
	LeadIcon,
	UsersIcon,
} from '@icons';

import usePanelStore from '@stores/panel.store.ts';
import './sidebar.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useAdminCompanyStore from '@stores/adminCompany.store';

const Sidebar: FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { isActivePath } = usePanelStore();
	const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
	const { companies } = useAdminCompanyStore();

	const isNotProviderAndReseller = !isProvider() && !isReseller();

	const isProviderWithAccess =
		isProvider() && companies.length > 0 && companies[0] !== null;

	const handleOpenSidebar = (action: 'enter' | 'leave') => {
		if (action === 'enter') {
			setIsSidebarOpen(true);
		} else if (action === 'leave') {
			setIsSidebarOpen(false);
		}
	};
	const menuItems = [
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
			haveAccess: isAdmin() || isProviderWithAccess,
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
			title: 'Web',
			id: 'sidebar_web',
			icon: <GlobeWebIcon />,
			to: '/web',
			root: false,
			haveAccess: isNotProviderAndReseller || isProviderWithAccess,
		},
		{
			title: 'Mobile',
			id: 'sidebar_mobile',
			icon: <MobileIcon />,
			to: '/mobile',
			root: false,
			haveAccess: isNotProviderAndReseller || isProviderWithAccess,
		},
		{
			title: 'Network',
			id: 'sidebar_net',
			icon: <LanIcon />,
			to: '/lan',
			root: false,
			haveAccess: isNotProviderAndReseller || isProviderWithAccess,
		},
		{
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
		},
		{
			title: 'Social Engineering',
			id: 'sidebar_social',
			icon: <PeopleGroupIcon />,
			to: '/social',
			root: false,
			haveAccess: isNotProviderAndReseller || isProviderWithAccess,
		},

		{
			title: 'Issues',
			id: 'sidebar_issues',
			icon: <BugIcon />,
			to: '/issues',
			root: false,
			haveAccess: isNotProviderAndReseller || isProviderWithAccess,
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
			title: 'Inx',
			id: 'sidebar_inx',
			icon: <InxIcon />,
			to: '/inx',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Sns',
			id: 'sidebar_sns',
			icon: <SnbIcon />,
			to: '/sns',
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
			title: 'Support',
			id: 'sidebar_support',
			icon: <MessageIcon />,
			to: '/support',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Preferences',
			id: 'sidebar_preferences',
			icon: <PreferenceIcon />,
			to: '/preferences',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
	];

	return (
		<aside
			className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}
			onMouseEnter={(e) => handleOpenSidebar('enter')}
			onMouseLeave={(e) => handleOpenSidebar('leave')}>
			{menuItems.map((item) => (
				<Fragment key={`sb-${item.id}`}>
					{item.haveAccess ? (
						<Link
							title={item.title}
							to={item.to}
							id={item.id}
							className={`${
								isActivePath(item.to, item.root) ? 'active' : ''
							}`}
							aria-label={item.title}
							data-text={item.title}>
							{item.icon}
						</Link>
					) : null}
				</Fragment>
			))}
		</aside>
	);
};

export default Sidebar;
