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
	const { open, isActivePath, handleChange } = usePanelStore();

	return (
		<aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
			{showAdmin && (
				<>
					<Link
						title="Admin Panel"
						to="/admin/company"
						className={`${
							isActivePath('/admin/company') ? ' active' : ''
						}`}
						onClick={() => open && handleChange()}
						data-text="Admin Panel">
						<AdminCompany />
					</Link>
				</>
			)}
			<Link
				title="Dashboard"
				to="/dashboard"
				className={`${isActivePath('/dashboard') ? ' active' : ''}`}
				data-text="Dashboard">
				<ChartIcon />
			</Link>

			<Link
				title="Web"
				to="/web"
				className={`${isActivePath('/web') ? ' active' : ''}`}
				data-text="Web">
				<GlobeWebIcon />
			</Link>

			<Link
				title="Mobile"
				to="/mobile"
				className={`${isActivePath('/mobile') ? ' active' : ''}`}
				data-text="Mobile">
				<MobileIcon />
			</Link>

			<Link
				title="Cloud"
				to="/cloud"
				className={`${isActivePath('/cloud') ? ' active' : ''}`}
				data-text="Cloud">
				<CLoudIcon />
			</Link>

			{/* 
				<Link
				title="Lan"
				to="/lan"
				className={`${
					isActivePath('/lan') ? ' active' : ''
				}`}
				data-text="Lan">
				<LanIcon />
	
			</Link>
				*/}

			<Link
				title="Enp"
				to="/enp"
				className={`${isActivePath('/enp') ? ' active' : ''}`}
				data-text="Enp">
				<EnpIcon />
			</Link>

			<Link
				title="Source Code"
				to="/source"
				className={`${isActivePath('/source') ? ' active' : ''}`}
				data-text="Source Code">
				<SourceCodeIcon />
			</Link>

			<Link
				title="Social Engineering"
				to="/social"
				className={`${isActivePath('/social') ? ' active' : ''}`}
				data-text="Social Engineering">
				<PeopleGroup />
			</Link>

			<Link
				title="Issues"
				to="/issues"
				className={`${isActivePath('/issues') ? ' active' : ''}`}
				data-text="Issues">
				<BugIcon />
			</Link>

			<Link
				title="Inx"
				to="/inx"
				className={`${isActivePath('/inx') ? ' active' : ''}`}
				data-text="Inx">
				<InxIcon />
			</Link>

			<Link
				title="Sns"
				to="/sns"
				className={`${isActivePath('/sns') ? ' active' : ''}`}
				data-text="Sns">
				<SnbIcon />
			</Link>

			<Link
				title="Vdb"
				to="/vdb"
				className={`${isActivePath('/vdb') ? ' active' : ''}`}
				data-text="Vdb">
				<VdbIcon />
			</Link>
		</aside>
	);
};

export default Sidebar;
