import React from 'react';
import { Link } from 'react-router-dom';
import {
	AdminCompany,
	BugIcon,
	CLoudIcon,
	ChartIcon,
	DataIcon,
	EnpIcon,
	GlobeWebIcon,
	InxIcon,
	/*LanIcon,*/
	MessageIcon,
	MobileIcon,
	PeopleGroup,
	PreferenceIcon,
	SnbIcon,
	VdbIcon,
	SourceCodeIcon,
} from '../../';

import { usePanelStore, useUserAdmin } from '../../../../data';
import './sidebar.scss';

const Sidebar: React.FC = () => {
	const { isCurrentAuthValid, isAdmin, getAccessToken } = useUserAdmin();
	const showAdmin =
		isCurrentAuthValid() && isAdmin() && getAccessToken() !== null;
	const { open, isActivePath } = usePanelStore();

	return (
		<aside
		className={`sidebar ${open ? 'sidebar-collapsed' : ''}`}>
			{showAdmin && (
				<>
					<Link
						title="Admin Panel"
						to="/admin/company"
						className={
							isActivePath('/admin/company')
								? 'active'
								: 'text-tertiary-color-300'
						}>
						<AdminCompany />
						<span className={open ? 'block' : 'hidden'}>Admin Panel</span>
					</Link>
				</>
			)}
			<Link
				title="Dashboard"
				to="/dashboard"
				className={
					isActivePath('/dashboard') ? 'active' : 'text-tertiary-color-300'
				}>
				<ChartIcon />
				<span className={open ? 'block' : 'hidden'}>Dashboard</span>
			</Link>

			<Link
				title="Web"
				to="/web"
				className={
					isActivePath('/web') ? ' active' : 'text-tertiary-color-300'
				}>
				<GlobeWebIcon />
				<span className={open ? 'block' : 'hidden'}>Web</span>
			</Link>

			<Link
				title="Mobile"
				to="/mobile"
				className={
					isActivePath('/mobile') ? ' active' : 'text-tertiary-color-300'
				}>
				<MobileIcon />
				<span className={open ? 'block' : 'hidden'}>Mobile</span>
			</Link>

			<Link
				title="Cloud"
				to="/cloud"
				className={
					isActivePath('/cloud') ? ' active' : 'text-tertiary-color-300'
				}>
				<CLoudIcon />
				<span className={open ? 'block' : 'hidden'}>Cloud</span>
			</Link>

			{/* 
				<Link
				title="Lan"
				to="/lan"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/lan')
						? ' active'
						: 'text-tertiary-color-300'
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
				className={
					isActivePath('/enp') ? ' active' : 'text-tertiary-color-300'
				}>
				<EnpIcon />
				<span className={open ? 'block' : 'hidden'}>Enp</span>
			</Link>

			<Link
				title="Source Code"
				to="/source"
				className={
					isActivePath('/source') ? ' active' : 'text-tertiary-color-300'
				}>
				<SourceCodeIcon />
				<span className={open ? 'block' : 'hidden'}>Source Code</span>
			</Link>

			<Link
				title="Social Engineering"
				to="/social"
				className={
					isActivePath('/social') ? ' active' : 'text-tertiary-color-300'
				}>
				<PeopleGroup />
				<span className={open ? 'block' : 'hidden'}>
					Social Engineering
				</span>
			</Link>

			<Link
				title="Issues"
				to="/issues"
				className={
					isActivePath('/issues') ? ' active' : 'text-tertiary-color-300'
				}>
				<BugIcon />
				<span className={open ? 'block' : 'hidden'}>Issues</span>
			</Link>

			<Link
				title="Inx"
				to="/inx"
				className={
					isActivePath('/inx') ? 'active' : 'text-tertiary-color-300'
				}>
				<InxIcon />
				<span className={open ? 'block' : 'hidden'}>Inx</span>
			</Link>

			<Link
				title="Sns"
				to="/sns"
				className={
					isActivePath('/sns') ? 'active' : 'text-tertiary-color-300'
				}>
				<SnbIcon />
				<span className={open ? 'block' : 'hidden'}>Sns</span>
			</Link>

			<Link
				title="Vdb"
				to="/vdb"
				className={
					isActivePath('/vdb') ? 'active' : 'text-tertiary-color-300'
				}>
				<VdbIcon />
				<span className={open ? 'block' : 'hidden'}>Vdb</span>
			</Link>
		</aside>
	);
};

export default Sidebar;
