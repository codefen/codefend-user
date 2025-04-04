import type { FC } from 'react';
import { Link } from 'react-router-dom';

const AuthNavigation: FC<{ location: string }> = ({ location }) => (
  <div className="nav">
    <span className={location === '/auth/signin' || location === '/auth/recovery' ? 'active' : ''}>
      <Link to="/auth/signin">access</Link>
    </span>
    <span
      className={
        location.startsWith('/auth/signup') || location === '/auth/confirmation' ? 'active' : ''
      }>
      <Link to="/auth/signup">new user</Link>
    </span>
  </div>
);

export default AuthNavigation;
