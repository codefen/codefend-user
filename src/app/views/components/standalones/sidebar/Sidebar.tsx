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
	PeopleGroup,
	SnbIcon,
	VdbIcon,
	SourceCodeIcon,
	ProfileIcon,
} from '../../';

import { usePanelStore, useUserAdmin, useUserProvider } from '../../../../data';
import './sidebar.scss';

const Sidebar: FC = () => {
	const { isAdmin } = useUserAdmin();
	const { isHacker } = useUserProvider();
	const { isActivePath } = usePanelStore();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	const [pressedKeys, setPressedKeys] = useState(new Set<string>());

	const handleOpenSidebar = (action: 'enter' | 'leave') => {
		if (action === 'enter') {
			setIsSidebarOpen(true);
		} else if (action === 'leave') {
			setIsSidebarOpen(false);
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			setPressedKeys((prevKeys) => {
				const newKeys = new Set([...prevKeys, event.key]);

				if (newKeys.has('h') && newKeys.has('Control')) {
					setIsHidden((prevState) => !prevState);
				}

				return newKeys;
			});
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			setPressedKeys(
				(prevKeys) =>
					new Set([...prevKeys].filter((key) => key !== event.key)),
			);
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

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
						to="/provider"
						className={`${isActivePath('/provider') ? 'active' : ''}`}
						title="Provider profile"
						aria-label="Provider profile"
						data-text="Provider profile">
						<ProfileIcon isVisible />
					</Link>
				</>
			)}

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
				<PeopleGroup />
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
			{isHidden && (
				<>
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
				</>
			)}
		</aside>
	);
};

export default Sidebar;
