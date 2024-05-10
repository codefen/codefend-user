import { type FC, Suspense, lazy, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router';
import { Link } from 'react-router-dom';
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

	useEffect(() => {
		const loadParticlesScript = () => {
			const particlesScript = document.createElement('script');
			particlesScript.src = '/particles/particles.js';
			particlesScript.async = true;
			particlesScript.onload = () => {
				const appScript = document.createElement('script');
				appScript.src = '/particles/app.js';
				appScript.async = true;
				document.body.appendChild(appScript);
				return () => {
					document.body.removeChild(appScript);
				};
			};
			document.body.appendChild(particlesScript);
			return () => {
				document.body.removeChild(particlesScript);
			};
		};

		loadParticlesScript();
	}, []);
	return !isAuth ? (
		<>
			<div id="particles-js">
				<canvas className="particles-js-canvas-el"></canvas>
			</div>
			<section className="access">
				<div className="forms">
					<div className="nav">
						<span
							className={
								location.pathname === '/auth/signin' ||
								location.pathname === '/auth/recovery'
									? 'active'
									: ''
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

				<div className="brand">
					<span>v1.0.0</span>
					<Logo theme={'shadow'} />
				</div>

				<div className="bkg"></div>
			</section>
		</>
	) : (
		<Navigate to={'/'} />
	);
};

export default AuthPage;
