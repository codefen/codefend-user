import React from 'react';
import { Link } from 'react-router-dom';
import { usePanelStore } from '../../../../../data/store/';
import './sidebarResponsive.scss';
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
  SourceCodeIcon
} from '../../..';

const menuItems = [
  { title: 'Dashboard', icon: <ChartIcon />, to: '/dashboard' },
  { title: 'Web', icon: <GlobeWebIcon />, to: '/web' },
  { title: 'Mobile', icon: <MobileIcon />, to: '/mobile' },
  { title: 'Cloud', icon: <CLoudIcon />, to: '/cloud' },
  //{ title: 'Lan', icon: <LanIcon />, to: '/lan' },
  { title: 'Enp', icon: <EnpIcon />, to: '/enp' },
  { title: 'Source', icon: <SourceCodeIcon />, to: '/source' },
  { title: 'Social', icon: <PeopleGroup />, to: '/social' },
  { title: 'Issues', icon: <BugIcon />, to: '/issues' },
  //{ title: 'Customer Support', icon: <MessageIcon />, to: '/support' },
  //{ title: 'Preferences', icon: <PreferenceIcon />, to: '/preferences' },
  { title: 'Inx', icon: <InxIcon />, to: '/inx' },
  { title: 'Sns', icon: <DataIcon />, to: '/sns' },
  { title: 'Vdb', icon: <DataIcon />, to: '/vdb' }
];

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

const SidebarResponsive: React.FC = () => {
  const { open, handleChange } = usePanelStore();

  return (
    <aside className={`sidenav ${open ? 'sidenav-open' : ''}`}>
      <div className="sidenav-content">
        <div className="sidenav-menu">
          {menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              title={menuItem.title}
              icon={menuItem.icon}
              to={menuItem.to}
              onClick={handleChange}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarResponsive;
