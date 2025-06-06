import { Link, type Location } from 'react-router';
import css from './changeAuth.module.scss';

export const ChangeAuthPages = ({ pathname }: { pathname: string }) => {
  return (
    <div className={css['change-page-container']}>
      <Link to="/auth/signin" className={pathname === '/auth/signin' ? css['active-link'] : ''}>
        Access
      </Link>
      <Link
        to="/auth/signup"
        className={pathname.startsWith('/auth/signup') ? css['active-link'] : ''}>
        New user
      </Link>
      {/* <Link
        to="/auth/recovery"
        className={pathname.startsWith('/auth/recovery') ? css['active-link'] : ''}>
        Password recovery
      </Link> */}
    </div>
  );
};
