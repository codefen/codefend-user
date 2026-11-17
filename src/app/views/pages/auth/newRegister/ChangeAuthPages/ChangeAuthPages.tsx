import { NavLink } from 'react-router';
import css from './changeAuth.module.scss';

export const ChangeAuthPages = () => (
  <nav className={css['change-page-container']} aria-label="Account access">
    <NavLink to="/user/access" className={({ isActive }) => isActive ? css['active-link'] : ''}>User access</NavLink>
    <NavLink to="/user/new" state={{ showSignupForm: true }} className={({ isActive }) => isActive ? css['active-link'] : ''}>New user</NavLink>
  </nav>
);
