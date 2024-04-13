import { type FC, Suspense, lazy } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router';
import { Link } from 'react-router-dom';

import { NetworkSetingModal } from '@modals/network-modal/NetworkSetingModal.tsx';
import type { NetworkSettingState } from '@stores/apiLink.store.ts';
import useNetworkSettingState from '@stores/apiLink.store.ts';
import useAuthStore from '@stores/auth.store.ts';
import './auth.scss';
import { useUserRole } from '#commonUserHooks/useUserRole';

const Logo = lazy(() => import('../../components/defaults/Logo'));

const AuthPage: FC = () => {
	const location = useLocation();
	const { isAuth } = useAuthStore((state) => state);
	const { isAdmin } = useUserRole();
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);

	return !isAuth ? (
		<>
			<NetworkSetingModal
				close={() => setNetworkSettingState(!isOpen)}
				isOpen={isOpen}
			/>
			<div className="codefend-img-bg">
				<Logo theme={'shadow'} />
			</div>
			<section className="flex access">
				<div className="container">
					<div className="brand"></div>
					<div className="xcodefend-img-bg">
						<Logo theme={'light'} />
					</div>
					<div className="forms">
						<div className="nav">
							<span
								className={
									location.pathname === '/auth/signin' ? 'active' : ''
								}>
								<Link to="/auth/signin">access</Link>
							</span>
							<span
								className={
									location.pathname.startsWith('/auth/signup') ||
									location.pathname === '/auth/confirmation'
										? 'active'
										: ''
								}>
								<Link to="/auth/signup">new user</Link>
							</span>
						</div>
						<Suspense fallback={<div>Loading...</div>}>
							<Outlet />
						</Suspense>
					</div>
				</div>
			</section>
		</>
	) : (
		<Navigate to={isAdmin() ? '/admin' : '/'} />
	);
};

export default AuthPage;
