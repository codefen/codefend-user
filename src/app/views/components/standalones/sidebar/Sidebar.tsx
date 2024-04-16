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
} from '@icons';

import usePanelStore from '@stores/panel.store.ts';
import './sidebar.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';

const Sidebar: FC = () => {
	const { isAdmin, isProvider, isReseller } = useUserRole();
	const { isActivePath } = usePanelStore();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleOpenSidebar = (action: 'enter' | 'leave') => {
		if (action === 'enter') {
			setIsSidebarOpen(true);
		} else if (action === 'leave') {
			setIsSidebarOpen(false);
		}
	};

	const isNotProviderAndReseller = !isProvider() && !isReseller();

	const menuItems = [
		{
			title: 'Admin Panel',
			id: 'sidebar_admin',
			icon: <AdminCompanyIcon />,
			to: '/admin/company',
			root: isAdmin(),
			haveAccess: isAdmin(),
		},
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
			icon: <ProviderOrdersIcon isVisible />,
			to: '/provider/orders',
			root: false,
			haveAccess: isProvider(),
		},
		{
			title: 'Reseller',
			id: 'sidebar_reseller',
			icon: <ProfileIcon isVisible />,
			to: '/reseller',
			root: isReseller(),
			haveAccess: isReseller(),
		},
		{
			title: 'Dashboard',
			id: 'sidebar_dashboard',
			icon: <ChartIcon />,
			to: '/dashboard',
			root: !isProvider() && !isReseller() && !isAdmin(),
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Web',
			id: 'sidebar_web',
			icon: <GlobeWebIcon />,
			to: '/web',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Mobile',
			id: 'sidebar_mobile',
			icon: <MobileIcon />,
			to: '/mobile',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Cloud',
			id: 'sidebar_cloud',
			icon: <CLoudIcon />,
			to: '/cloud',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Source Code',
			id: 'sidebar_source',
			icon: <SourceCodeIcon />,
			to: '/source',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Social Engineering',
			id: 'sidebar_social',
			icon: <PeopleGroupIcon />,
			to: '/social',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		//{ title: 'Network', icon: <LanIcon />, to: '/lan' },

		{
			title: 'Issues',
			id: 'sidebar_issues',
			icon: <BugIcon />,
			to: '/issues',
			root: false,
			haveAccess: isNotProviderAndReseller,
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
				<Fragment key={`sb-${item.title}`}>
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
