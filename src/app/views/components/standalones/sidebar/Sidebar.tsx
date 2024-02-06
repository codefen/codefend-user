import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import {
	ChartIcon,
	GlobeWebIcon,
	MobileIcon,
	CLoudIcon,
	LanIcon,
	EnpIcon,
	SourceCodeIcon,
	PeopleGroup,
	BugIcon,
	MessageIcon,
	PreferenceIcon,
	InxIcon,
	DataIcon,
	AdminUser,
	AdminCompany,
	Show,
} from '../../';

import { RUNNING_DESKTOP, useUserAdmin } from '../../../../data';
import './sidebar.scss';

const isActivePath = (verifyPath: string) => {
	const location = useLocation();
	const currentPath = location.pathname;
	if (currentPath === '/' && verifyPath === '/dashboard') return 'active';
	return currentPath.startsWith(verifyPath);
};

const Sidebar: React.FC = () => {
	const { isAuth, isAdmin, getAccessToken } = useUserAdmin();
	const showAdmin = isAuth() && isAdmin() && getAccessToken() !== null;
	return (
		<aside className="sidebar">
			{showAdmin && (
				<>
					<Link
						title="Admin Panel"
						to="/admin/company"
						className={isActivePath('/admin/company') ? 'active' : ''}>
						<AdminCompany />
					</Link>
				</>
			)}
			<Link
				title="Dashboard"
				to="/dashboard"
				className={isActivePath('/dashboard') ? 'active' : ''}>
				<ChartIcon />
			</Link>

			<Link
				title="Web"
				to="/web"
				className={isActivePath('/web') ? 'active' : ''}>
				<GlobeWebIcon />
			</Link>

			<Link
				title="Mobile"
				to="/mobile"
				className={isActivePath('/mobile') ? 'active' : ''}>
				<MobileIcon />
			</Link>

			<Link
				title="Cloud"
				to="/cloud"
				className={isActivePath('/cloud') ? 'active' : ''}>
				<CLoudIcon />
			</Link>

			<Link
				title="Lan"
				to="/lan"
				className={isActivePath('/lan') ? 'active' : ''}>
				<LanIcon />
			</Link>


				<Link title="Enp" to="/enp" className={isActivePath('/enp') ? 'active' : ''}>
					<EnpIcon />
				</Link>
{/*
			<Show when={RUNNING_DESKTOP()}>
				<Link title="Enp" to="/enp" className={isActivePath('/enp')}>
					<EnpIcon />
				</Link>
			</Show> */}

			<Link
				title="Source Code"
				to="/source"
				className={isActivePath('/source') ? 'active' : ''}>
				<SourceCodeIcon />
			</Link>

			<Link
				title="Social Engineering"
				to="/social"
				className={isActivePath('/social') ? 'active' : ''}>
				<PeopleGroup />
			</Link>

			<Link
				title="Issues"
				to="/issues"
				className={isActivePath('/issues') ? 'active' : ''}>
				<BugIcon />
			</Link>

			<Link
				title="Customer Support"
				to="/support"
				className={isActivePath('/support') ? 'active' : ''}>
				<MessageIcon />
			</Link>

			<Link
				to="/preferences"
				className={isActivePath('/preferences') ? 'active' : ''}>
				<PreferenceIcon />
			</Link>

			<Link
				title="Inx"
				to="/inx"
				className={isActivePath('/inx') ? 'active' : ''}>
				<InxIcon />
			</Link>

			<Link
				title="Sns"
				to="/sns"
				className={isActivePath('/sns') ? 'active' : ''}>
				<DataIcon />
			</Link>

			<Link
				title="Vdb"
				to="/vdb"
				className={isActivePath('/vdb') ? 'active' : ''}>
				<DataIcon />
			</Link>
		</aside>
	);
};

export default Sidebar;
