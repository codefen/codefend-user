import { lazy, type FC } from 'react';

const Logo = lazy(() => import('../defaults/Logo'));

const BrandAndAppVersion: FC = () => (
	<div className="brand">
		<span>v1.0.0</span>
		<Logo theme={'shadow'} />
	</div>
);

export default BrandAndAppVersion;
