import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	AdminCompany,
	BugIcon,
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
} from '../../';

import { usePanelStore, useUserAdmin, useUserProvider } from '../../../../data';
import './sidebar.scss';

const Sidebar: FC = () => {
	const { isAdmin } = useUserAdmin();
	const { isHacker } = useUserProvider();
	const { isActivePath } = usePanelStore();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleOpenSidebar = (action: 'enter' | 'leave') => {
		if (action === 'enter') {
			setIsSidebarOpen(true);
		} else if (action === 'leave') {
			setIsSidebarOpen(false);
		}
	};

	return (
		<aside
			className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}
			onMouseEnter={(e) => handleOpenSidebar('enter')}
			onMouseLeave={(e) => handleOpenSidebar('leave')}>
			{isAdmin() && (
				<>
					<Link
						title="Admin Panel"
						to="/admin/company"
						className={`${
							isActivePath('/admin/company') ? 'active' : ''
						}`}
						aria-label="Admin panel"
						data-text="Admin panel">
						<AdminCompany />
					</Link>
				</>
			)}
			{isHacker() && (
				<>
					<Link
						to="/provider/profile"
						className={`${isActivePath('/provider/profile') ? 'active' : ''}`}
						title="My profile"
						aria-label="My profile"
						data-text="My profile">
						<ProfileIcon isVisible />
					</Link>
					<Link
						to="/provider/orders"
						className={`${isActivePath('/provider/orders') ? 'active' : ''}`}
						title="Orders"
						aria-label="Orders"
						data-text="Orders">
						<ProviderOrdersIcon isVisible />
					</Link>
				</>
			)}

			{!isHacker() && (
				<>
					<Link
						title="Dashboard"
						to="/dashboard"
						className={`${isActivePath('/dashboard') ? 'active' : ''}`}
						aria-label="Dashboard"
						data-text="Dashboard">
						<ChartIcon />
					</Link>
					<Link
						title="Web"
						to="/web"
						className={`${isActivePath('/web') ? 'active' : ''}`}
						aria-label="Web"
						data-text="Web">
						<GlobeWebIcon />
					</Link>

					<Link
						title="Mobile"
						to="/mobile"
						className={`${isActivePath('/mobile') ? 'active' : ''}`}
						aria-label="Mobile"
						data-text="Mobile">
						<MobileIcon />
					</Link>

					<Link
						title="Cloud"
						to="/cloud"
						className={`${isActivePath('/cloud') ? 'active' : ''}`}
						aria-label="Cloud"
						data-text="Cloud">
						<CLoudIcon />
					</Link>

					{/* <Link
				title="Network"
				to="/lan"
				className={`${
					isActivePath('/lan') ? ' active' : ''
				}`}
				data-text="Lan">
				<LanIcon />
			</Link> */}

					<Link
						title="Source Code"
						to="/source"
						className={`${isActivePath('/source') ? 'active' : ''}`}
						aria-label="Source Code"
						data-text="Source Code">
						<SourceCodeIcon />
					</Link>

					<Link
						title="Social Engineering"
						to="/social"
						className={`${isActivePath('/social') ? 'active' : ''}`}
						aria-label="Social Engineering"
						data-text="Social Engineering">
						<PeopleGroupIcon />
					</Link>

					<Link
						title="Enp"
						to="/enp"
						className={`${isActivePath('/enp') ? 'active' : ''}`}
						aria-label="Endpoint monitoring"
						data-text="Endpoint monitoring">
						<EnpIcon />
					</Link>

					<Link
						title="Issues"
						to="/issues"
						className={`${isActivePath('/issues') ? 'active' : ''}`}
						aria-label="Issues"
						data-text="Issues">
						<BugIcon />
					</Link>

					<Link
						title="Inx"
						to="/inx"
						className={`${isActivePath('/inx') ? 'active' : ''}`}
						aria-label="Intelligence"
						data-text="Intelligence">
						<InxIcon />
					</Link>

					<Link
						title="Sns"
						to="/sns"
						className={`${isActivePath('/sns') ? 'active' : ''}`}
						aria-label="Search dataleak"
						data-text="Search data leak">
						<SnbIcon />
					</Link>

					<Link
						title="Vdb"
						to="/vdb"
						className={`${isActivePath('/vdb') ? 'active' : ''}`}
						aria-label="Vdb"
						data-text="Vdb">
						<VdbIcon />
					</Link>

					<Link
						title="Preference"
						to="/preferences"
						className={`${isActivePath('/preferences') ? 'active' : ''}`}
						aria-label="Preference"
						data-text="Preference">
						<PreferenceIcon />
					</Link>
					<Link
						title="Support"
						to="/support"
						className={`${isActivePath('/support') ? 'active' : ''}`}
						aria-label="Support"
						data-text="Support">
						<MessageIcon />
					</Link>
				</>
			)}
		</aside>
	);
};

export default Sidebar;
