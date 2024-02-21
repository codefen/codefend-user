import React from 'react';
import { Link } from 'react-router-dom';
import {
	AdminCompany,
	BugIcon,
	CLoudIcon,
	ChartIcon,
	EnpIcon,
	GlobeWebIcon,
	InxIcon,
	/*LanIcon,*/
	MobileIcon,
	PeopleGroup,
	SnbIcon,
	VdbIcon,
	SourceCodeIcon,
	DataIcon,
} from '../../';

import { usePanelStore, useUserAdmin } from '../../../../data';
import './sidebar.scss';

const Sidebar: React.FC = () => {
	const { isCurrentAuthValid, isAdmin, getAccessToken } = useUserAdmin();
	const showAdmin =
		isCurrentAuthValid() && isAdmin() && getAccessToken() !== null;
	const { open, isActivePath } = usePanelStore();

	return (
		<aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
			{showAdmin && (
				<>
					<Link
						title="Admin Panel"
						to="/admin/company"
						className={isActivePath('/admin/company') ? 'active' : ''}>
						<AdminCompany />
						<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
							Admin Panel
						</span>
					</Link>
				</>
			)}
			<Link
				title="Dashboard"
				to="/dashboard"
				className={isActivePath('/dashboard') ? 'active' : ''}>
				<ChartIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Dashboard
				</span>
			</Link>

			<Link
				title="Web"
				to="/web"
				className={isActivePath('/web') ? ' active' : ''}>
				<GlobeWebIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Web
				</span>
			</Link>

			<Link
				title="Mobile"
				to="/mobile"
				className={isActivePath('/mobile') ? ' active' : ''}>
				<MobileIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Mobile
				</span>
			</Link>

			<Link
				title="Cloud"
				to="/cloud"
				className={isActivePath('/cloud') ? ' active' : ''}>
				<CLoudIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Cloud
				</span>
			</Link>

			{/* 
				<Link
				title="Lan"
				to="/lan"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/lan')
						? ' active'
						: ''
				}`}>
				<LanIcon />
				<span
					className={`${
						!open && 'hidden'
					}  p-[10px] origin-left duration-700`}>
					Lan
				</span>
			</Link>
				*/}

			<Link
				title="Enp"
				to="/enp"
				className={isActivePath('/enp') ? ' active' : ''}>
				<EnpIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Enp
				</span>
			</Link>

			<Link
				title="Source Code"
				to="/source"
				className={isActivePath('/source') ? ' active' : ''}>
				<SourceCodeIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Source Code
				</span>
			</Link>

			<Link
				title="Social Engineering"
				to="/social"
				className={isActivePath('/social') ? ' active' : ''}>
				<PeopleGroup />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Social Engineering
				</span>
			</Link>

			<Link
				title="Issues"
				to="/issues"
				className={isActivePath('/issues') ? ' active' : ''}>
				<BugIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Issues
				</span>
			</Link>

			<Link
				title="Inx"
				to="/inx"
				className={isActivePath('/inx') ? 'active' : ''}>
				<InxIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Inx
				</span>
			</Link>

			<Link
				title="Sns"
				to="/sns"
				className={isActivePath('/sns') ? 'active' : ''}>
				<SnbIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Sns
				</span>
			</Link>

			<Link
				title="Vdb"
				to="/vdb"
				className={isActivePath('/vdb') ? 'active' : ''}>
				<DataIcon />
				<span className={`${!open ? 'sidebar-text-visible' : ''}`}>
					Vdb
				</span>
			</Link>
		</aside>
	);
};

export default Sidebar;
