import React from 'react';
import { Link } from 'react-router-dom';
import {
	BugIcon,
	CLoudIcon,
	ChartIcon,
	DataIcon,
	EnpIcon,
	GlobeWebIcon,
	InxIcon,
	LanIcon,
	MessageIcon,
	MobileIcon,
	PeopleGroup,
	PreferenceIcon,
	SourceCodeIcon,
} from '../../..';
import { usePanelStore } from '../../../../../data/store/';

const SidebarResponsive: React.FC = () => {
	const { open, isActivePath } = usePanelStore();
	
	return (
		<aside
			className={
				`relative duration-300
					${!open ? 'w-16' : 'w-full'}
					flex justify-between h-[100vh] bg-[#121a23] text-gray-400 flex-col
			`}>
			<Link
				title="Dashboard"
				to="/dashboard"
				className="flex items-center h-12 mb-0 px-6 py-1.75 border-solid border ">
				<ChartIcon />
				<span
					className={`
					duration-400
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Dashboard
				</span>
			</Link>

			<Link
				title="Web"
				to="/web"
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
				<CLoudIcon />
				<span
					className={`
					duration-600
					${!open && 'hidden'}  p-[10px] origin-left min-w-[150px]`}>
					Cloud
				</span>
			</Link>

			<Link
				title="Lan"
				to="/lan"
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200">
				<LanIcon />
				<span
					className={`${
						!open && 'hidden'
					}  p-[10px] origin-left duration-700`}>
					Lan
				</span>
			</Link>

			<Link
				title="Enp"
				to="/enp"
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 border-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 border-solid border-gray-200 ">
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
				<DataIcon />
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
				className="flex items-center h-12 mb-0 px-6 py-1.75 order-solid border-gray-200 ">
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

export default SidebarResponsive;
