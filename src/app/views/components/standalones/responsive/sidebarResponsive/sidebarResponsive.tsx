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
	ThemeChangerButton,
} from '../../..';
import { useAuthStore, usePanelStore } from '../../../../../data/store/';
import './sidebarResponsive.scss';

const SidebarResponsive: React.FC = () => {
	const { open, handleChange } = usePanelStore();
	const { userData } = useAuthStore();

	return (
		<aside className={`sidenav ${open ? 'sidenav-open' : ''}`}>
			<div className="sidenav-content">
				
				<div className="sidenav-menu">
					<MenuItem
						title="Dashboard"
						icon={<ChartIcon />}
						to="/dashboard"
						onClick={handleChange}
					/>
					<MenuItem
						title="Web"
						icon={<GlobeWebIcon />}
						to="/web"
						onClick={handleChange}
					/>
					<MenuItem
						title="Mobile"
						icon={<MobileIcon />}
						to="/mobile"
						onClick={handleChange}
					/>
					<MenuItem
						title="Cloud"
						icon={<CLoudIcon />}
						to="/cloud"
						onClick={handleChange}
					/>
					<MenuItem
						title="Lan"
						icon={<LanIcon />}
						to="/lan"
						onClick={handleChange}
					/>
					<MenuItem
						title="Enp"
						icon={<EnpIcon />}
						to="/enp"
						onClick={handleChange}
					/>
					<MenuItem
						title="Source Code"
						icon={<SourceCodeIcon />}
						to="/source"
						onClick={handleChange}
					/>
					<MenuItem
						title="Social Engineering"
						icon={<PeopleGroup />}
						to="/social"
						onClick={handleChange}
					/>
					<MenuItem
						title="Issues"
						icon={<BugIcon />}
						to="/issues"
						onClick={handleChange}
					/>
					<MenuItem
						title="Customer Support"
						icon={<MessageIcon />}
						to="/support"
						onClick={handleChange}
					/>
					<MenuItem
						title="Preferences"
						icon={<PreferenceIcon />}
						to="/preferences"
						onClick={handleChange}
					/>
					<MenuItem
						title="Inx"
						icon={<InxIcon />}
						to="/inx"
						onClick={handleChange}
					/>
					<MenuItem
						title="Sns"
						icon={<DataIcon />}
						to="/sns"
						onClick={handleChange}
					/>
					<MenuItem
						title="Vdb"
						icon={<DataIcon />}
						to="/vdb"
						onClick={handleChange}
					/>
				</div>
			</div>
		</aside>
	);
};

interface MenuItemProps {
	title: string;
	icon: JSX.Element;
	to: string;
	onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, to, onClick }) => {
	return (
		<Link to={to} className="sidenav-link" onClick={onClick}>
			{icon}
			<span className="sidenav-link-text">{title}</span>
		</Link>
	);
};

export default SidebarResponsive;
