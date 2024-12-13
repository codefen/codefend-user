import { lazy, type FC } from 'react';

const Logo = lazy(() => import('../defaults/Logo'));

const BrandAndAppVersion: FC = () => (
  <div className="brand">
    <span>v24.3.1</span>
    <Logo theme={'shadow'} />
  </div>
);

export default BrandAndAppVersion;
