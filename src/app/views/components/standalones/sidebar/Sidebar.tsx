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
	const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
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
			icon: <AdminCompanyIcon />,
			to: '/admin/company',
			root: isAdmin(),
			haveAccess: isAdmin(),
		},
		{
			title: 'My profile',
			icon: <ProfileIcon isVisible />,
			to: '/provider/profile',
			root: isProvider(),
			haveAccess: isProvider(),
		},
		{
			title: 'Orders',
			icon: <ProviderOrdersIcon isVisible />,
			to: '/provider/orders',
			root: false,
			haveAccess: isProvider(),
		},
		{
			title: 'Reseller',
			icon: <ProfileIcon isVisible />,
			to: '/reseller',
			root: isReseller(),
			haveAccess: isReseller(),
		},
		{
			title: 'Dashboard',
			icon: <ChartIcon />,
			to: '/dashboard',
			root: !isProvider() && !isReseller() && !isAdmin(),
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Web',
			icon: <GlobeWebIcon />,
			to: '/web',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Mobile',
			icon: <MobileIcon />,
			to: '/mobile',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Cloud',
			icon: <CLoudIcon />,
			to: '/cloud',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Source Code',
			icon: <SourceCodeIcon />,
			to: '/source',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Social Engineering',
			icon: <PeopleGroupIcon />,
			to: '/social',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		//{ title: 'Network', icon: <LanIcon />, to: '/lan' },
		{
			title: 'Enp',
			icon: <EnpIcon />,
			to: '/enp',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Issues',
			icon: <BugIcon />,
			to: '/issues',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Inx',
			icon: <InxIcon />,
			to: '/inx',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Sns',
			icon: <SnbIcon />,
			to: '/sns',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Vdb',
			icon: <VdbIcon />,
			to: '/vdb',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Preference',
			icon: <PreferenceIcon />,
			to: '/preference',
			root: false,
			haveAccess: isNotProviderAndReseller,
		},
		{
			title: 'Support',
			icon: <MessageIcon />,
			to: '/support',
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
				<Fragment key={`sb-${item.to}`}>
					{item.haveAccess ? (
						<Link
							title={item.title}
							to={item.to}
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
