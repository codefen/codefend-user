import React, { useEffect, useRef, useState } from 'react';
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
	const { isActivePath } = usePanelStore();

	const sidebarRef = useRef<HTMLDivElement | null>(null);

	const handleViewText = (action: 'enter' | 'leave') => {
		const currentRef = sidebarRef?.current!;
		let timeID: ReturnType<typeof setTimeout>;
		if (
			currentRef &&
			action === 'enter' &&
			!currentRef.classList.contains('is-open')
		) {
			timeID = setTimeout(() => currentRef.classList.add('is-open'), 100);
		} else if (
			currentRef &&
			action === 'leave' &&
			currentRef.classList.contains('is-open')
		) {
			clearTimeout(timeID!);
			currentRef.classList.remove('is-open');
		}
	};

	return (
		<aside
			ref={sidebarRef}
			className={`sidebar`}
			// onFocus={(e) => handleViewText('enter')}
			onMouseEnter={(e) => handleViewText('enter')}
			onMouseUp={(e) => handleViewText('leave')}
			onBlur={(e) => handleViewText('leave')}
			onMouseLeave={(e) => handleViewText('leave')}>
			{showAdmin && (
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
				className={`${isActivePath('/enp') ? 'active' : ''}`}
				aria-label="Endpoint monitoring"
				data-text="Endpoint monitoring">
				<EnpIcon />
			</Link>

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
		</aside>
	);
};

export default Sidebar;
