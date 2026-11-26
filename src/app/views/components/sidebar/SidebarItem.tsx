import { PureComponent, type ReactNode } from 'react';
import { Link } from 'react-router';

interface SidebarItemProps {
  id: string;
  title: string;
  to: string;
  icon?: ReactNode;
  isActive: boolean;
  isAuth: boolean;
  onClick?: () => void;
}

export class SidebarItem extends PureComponent<SidebarItemProps> {
  override render() {
    const { id, title, to, icon, isActive, isAuth, onClick } = this.props;
    return (
      <Link
        title={title}
        to={isAuth ? to : ''}
        id={id}
        className={`${isActive ? 'active' : ''}`}
        aria-label={title}
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}>
        {icon ? <span className="sidebar-item-icon">{icon}</span> : null}
        <span className="sidebar-item-label">{title}</span>
      </Link>
    );
  }
}
