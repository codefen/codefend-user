import type { FC } from 'react';
import { Link } from 'react-router-dom';

const AuthNavigation: FC<{ location: string }> = ({ location }) => (
  <div className="nav">
    <span className={location === '/user/access' || location === '/auth/recovery' ? 'active' : ''}>
      <Link to="/user/access">access</Link>
    </span>
    <span
      className={
        location.startsWith('/user/new') || location === '/auth/confirmation' ? 'active' : ''
      }>
      <Link to="/user/new">new user</Link>
    </span>
  </div>
);

export default AuthNavigation;
