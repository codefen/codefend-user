import { lazy, type FC } from 'react';

const Logo = lazy(() => import('../Logo/Logo'));

const BrandAndAppVersion: FC = () => (
  <div className="brand">
    <span>v25.0.2</span>
    <Logo theme={'shadow'} />
  </div>
);

export default BrandAndAppVersion;
