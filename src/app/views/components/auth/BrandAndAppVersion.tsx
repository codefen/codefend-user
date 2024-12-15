import { lazy, type FC } from 'react';

const Logo = lazy(() => import('../defaults/Logo'));

const BrandAndAppVersion: FC = () => (
  <div className="brand">
    <span>v24.2.2</span>
    <Logo theme={'shadow'} />
  </div>
);

export default BrandAndAppVersion;
