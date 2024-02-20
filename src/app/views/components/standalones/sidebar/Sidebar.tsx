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
			className={`sidebar relative duration-300 bg-primary-color-100 dark:bg-[#121a23]
					${!open ? 'w-[4.08rem]' : 'w-60'}
					flex  justify-between h-[100vh]  text-primary-color-50 flex-col
			`}>
			{showAdmin && (
				<>
					<Link
						title="Admin Panel"
						to="/admin/company"
						className={`flex items-center text-tertiary-color-300 h-12 mb-0 px-6 py-1.75  ${
							isActivePath('/admin/company')
								? 'active'
								: 'text-tertiary-color-300'
						}`}>
						<AdminCompany />
						<span
							className={`
								duration-600
								${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
							Admin Panel
						</span>
					</Link>
				</>
			)}
			<Link
				title="Dashboard"
				to="/dashboard"
				className={`flex items-center h-12 mb-0 px-6 py-1.75  ${
					isActivePath('/dashboard') ? 'active' : 'text-tertiary-color-300'
				}`}>
				<ChartIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Dashboard
				</span>
			</Link>

			<Link
				title="Web"
				to="/web"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/web') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<GlobeWebIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Web
				</span>
			</Link>

			<Link
				title="Mobile"
				to="/mobile"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/mobile') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<MobileIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Mobile
				</span>
			</Link>

			<Link
				title="Cloud"
				to="/cloud"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/cloud') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<CLoudIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
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
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/enp') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<EnpIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Enp
				</span>
			</Link>

			<Link
				title="Source Code"
				to="/source"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/source') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<SourceCodeIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Source Code
				</span>
			</Link>

			<Link
				title="Social Engineering"
				to="/social"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/social') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<PeopleGroup />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Social Engineering
				</span>
			</Link>

			<Link
				title="Issues"
				to="/issues"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/issues') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<BugIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Issues
				</span>
			</Link>

			<Link
				title="Customer Support"
				to="/support"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/support') ? ' active' : 'text-tertiary-color-300'
				}`}>
				<MessageIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Customer Support
				</span>
			</Link>

			<Link
				to="/preferences"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/preferences')
						? ' active'
						: 'text-tertiary-color-300'
				}`}>
				<PreferenceIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Preferences
				</span>
			</Link>

			<Link
				title="Inx"
				to="/inx"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/inx') ? 'active' : 'text-tertiary-color-300'
				}`}>
				<InxIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Inx
				</span>
			</Link>

			<Link
				title="Sns"
				to="/sns"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/sns') ? 'active' : 'text-tertiary-color-300'
				}`}>
				<SnbIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Sns
				</span>
			</Link>

			<Link
				title="Vdb"
				to="/vdb"
				className={`flex items-center h-12 mb-0 px-6 py-1.75 ${
					isActivePath('/vdb') ? 'active' : 'text-tertiary-color-300'
				}`}>
				<DataIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Vdb
				</span>
			</Link>
		</aside>
	);
};

export default Sidebar;
