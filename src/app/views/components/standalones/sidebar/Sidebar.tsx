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
	return currentPath.startsWith(verifyPath) ? 'active' : '';
};

const Sidebar: React.FC = () => {
	const { isAuth, isAdmin, getAccessToken } = useUserAdmin();
	return (
		<aside className="sidebar">
			<Link
				title="Dashboard"
				to="/dashboard"
				className={isActivePath('/dashboard')}>
				<ChartIcon />
			</Link>

			<Show when={isAuth() && isAdmin() && getAccessToken() !== null}>
				<>
					<Link
						to="/admin/company"
						className={isActivePath('/admin/company')}>
						<AdminCompany />
					</Link>
					<Link
						title="Admin Panel"
						to="/admin/panel"
						className={isActivePath('/admin/panel')}>
						<AdminUser />
					</Link>
				</>
			</Show>

			<Link title="Web" to="/web" className={isActivePath('/web')}>
				<GlobeWebIcon />
			</Link>

			<Link title="Mobile" to="/mobile" className={isActivePath('/mobile')}>
				<MobileIcon />
			</Link>

			<Link title="Cloud" to="/cloud" className={isActivePath('/cloud')}>
				<CLoudIcon />
			</Link>

			<Link title="Lan" to="/lan" className={isActivePath('/lan')}>
				<LanIcon />
			</Link>

			<Show when={RUNNING_DESKTOP()}>
				<Link title="Enp" to="/enp" className={isActivePath('/enp')}>
					<EnpIcon />
				</Link>
			</Show>

			<Link
				title="Source Code"
				to="/source"
				className={isActivePath('/source')}>
				<SourceCodeIcon />
			</Link>

			<Link
				title="Social Engineering"
				to="/social"
				className={isActivePath('/social')}>
				<PeopleGroup />
			</Link>

			<Link title="Issues" to="/issues" className={isActivePath('/issues')}>
				<BugIcon />
			</Link>

			<Link
				title="Customer Support"
				to="/support"
				className={isActivePath('/support')}>
				<MessageIcon />
			</Link>

			<Link to="/preferences" className={isActivePath('/preferences')}>
				<PreferenceIcon />
			</Link>

			<Link title="Inx" to="/inx" className={isActivePath('/inx')}>
				<InxIcon />
			</Link>

			<Link title="Sns" to="/sns" className={isActivePath('/sns')}>
				<DataIcon />
			</Link>

			<Link title="Vdb" to="/vdb" className={isActivePath('/vdb')}>
				<DataIcon />
			</Link>
		</aside>
	);
};

export default Sidebar;
