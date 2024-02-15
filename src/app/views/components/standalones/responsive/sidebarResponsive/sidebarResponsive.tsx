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
import './sidebarResponsive.scss';

const SidebarResponsive: React.FC = () => {
	const { open, isActivePath } = usePanelStore();

	return (
		<aside className={`sidenav ${open ? 'sidenav-collapsed' : ''}`}>
			<ul className={`sidenav-nav ${!open ? 'hidden' : ''}`}>
				<li className="sidenav-nav-item">
					<Link
						title="Dashboard"
						to="/dashboard"
						className="sidenav-link-link ">
						<ChartIcon />
						<span
							className="sidenav-link-text">
							Dashboard
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Web" to="/web" className="sidenav-link-link">
						<GlobeWebIcon />
						<span
							className="sidenav-link-text">
							Web
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Mobile" to="/mobile" className="sidenav-link-link ">
						<MobileIcon />
						<span
							className="sidenav-link-text">
							Mobile
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Cloud" to="/cloud" className="sidenav-link-link ">
						<CLoudIcon />
						<span
							className="sidenav-link-text">
							Cloud
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Lan" to="/lan" className="sidenav-link-link">
						<LanIcon />
						<span
							className="sidenav-link-text">
							Lan
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Enp" to="/enp" className="sidenav-link-link ">
						<EnpIcon />
						<span
							className="sidenav-link-text">
							Enp
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link
						title="Source Code"
						to="/source"
						className="sidenav-link-link ">
						<SourceCodeIcon />
						<span
							className="sidenav-link-text">
							Source Code
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link
						title="Social Engineering"
						to="/social"
						className="sidenav-link-link">
						<PeopleGroup />
						<span
							className="sidenav-link-text">
							Social Engineering
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Issues" to="/issues" className="sidenav-link-link ">
						<BugIcon />
						<span
							className="sidenav-link-text">
							Issues
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link
						title="Customer Support"
						to="/support"
						className="sidenav-link-link ">
						<MessageIcon />
						<span
							className="sidenav-link-text">
							Customer Support
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link to="/preferences" className="sidenav-link-link ">
						<PreferenceIcon />
						<span
							className="sidenav-link-text">
							Preferences
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link
						title="Inx"
						to="/inx"
						className="sidenav-link-link">
						<InxIcon />
						<span
							className="sidenav-link-text">
							Inx
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Sns" to="/sns" className="sidenav-link-link ">
						<DataIcon />
						<span
							className="sidenav-link-text">
							Sns
						</span>
					</Link>
				</li>

				<li className="sidenav-nav-item">
					<Link title="Vdb" to="/vdb" className="sidenav-link-link ">
						<DataIcon />
						<span
							className="sidenav-link-text">
							Vdb
						</span>
					</Link>
				</li>
			</ul>
		</aside>
	);
};

export default SidebarResponsive;
