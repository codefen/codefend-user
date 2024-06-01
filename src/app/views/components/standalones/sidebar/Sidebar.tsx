import {
	type FC,
	useState,
	PureComponent,
	type ReactNode,
	useCallback,
} from 'react';
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

import './sidebar.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { useUserData } from '#commonUserHooks/useUserData';

interface SidebarItemProps {
	id: string;
	title: string;
	to: string;
	icon?: ReactNode;
	isActive: boolean;
}

const verifyPath = (verifyPath: string, isRoot: boolean) => {
	const currentPath = window.location.pathname;
	if (currentPath === '/' && isRoot) return true;
	return currentPath.startsWith(verifyPath);
};

class SidebarItem extends PureComponent<SidebarItemProps> {
	override render() {
		const { id, title, to, icon, isActive } = this.props;
		return (
			<Link
				title={title}
				to={to}
				id={id}
				className={`${isActive ? 'active' : ''}`}
				aria-label={title}
				data-text={title}>
				{icon}
			</Link>
		);
	}
}

const Sidebar: FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { getUserdata } = useUserData();
	const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
	const { companies, companySelected } = useAdminCompanyStore();

	const isNotProviderAndReseller = !isProvider() && !isReseller();

	const isProviderWithAccess =
		isProvider() &&
		companies.length > 0 &&
		companies[0] !== null &&
		companySelected?.id !== getUserdata().company_id;

	const handleOpenSidebar = (action: 'enter' | 'leave') => {
		setIsSidebarOpen(action === 'enter' ? true : false);
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
			haveAccess:
				isAdmin() ||
				(isProvider() && companies.length > 0 && companies[0] !== null),
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
			title: 'Customer Support',
			id: 'sidebar_support',
			icon: <MessageIcon />,
			to: '/cs',
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
		{
			title: 'inx',
			id: 'sidebar_inx',
			icon: <InxIcon />,
			to: '/inx',
			root: false,
			haveAccess: !isReseller(),
		},
		{
			title: 'Sns',
			id: 'sidebar_sns',
			icon: <SnbIcon />,
			to: '/sns',
			root: false,
			haveAccess: !isReseller(),
		},
	];
	const getItems = useCallback((menu: any[]) => {
		const items: JSX.Element[] = [];
		const count = menu.length;
		for (let i = 0; i < count; i++) {
			const { id, haveAccess, title, icon, to, root } = menu[i];
			if (haveAccess) {
				items.push(
					<SidebarItem
						key={`sb-${id}`}
						id={id}
						title={title}
						icon={icon}
						to={to}
						isActive={verifyPath(to, root)}
					/>,
				);
			}
		}
		return items;
	}, []);
	return (
		<aside
			className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}
			onMouseEnter={(e) => handleOpenSidebar('enter')}
			onMouseLeave={(e) => handleOpenSidebar('leave')}>
			{getItems(menuItems)}
		</aside>
	);
};

export default Sidebar;
