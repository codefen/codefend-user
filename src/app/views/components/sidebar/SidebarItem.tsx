import { PureComponent, type ReactNode } from 'react';
import { Link } from 'react-router';

interface SidebarItemProps {
  id: string;
  title: string;
  to: string;
  icon?: ReactNode;
  isActive: boolean;
  isAuth: boolean;
}

export class SidebarItem extends PureComponent<SidebarItemProps> {
  override render() {
    const { id, title, to, icon, isActive, isAuth } = this.props;
    return (
      <Link
        title={title}
        to={isAuth ? to : ''}
        id={id}
        className={`${isActive ? 'active' : ''}`}
        aria-label={title}>
        {title}
      </Link>
    );
  }
}
