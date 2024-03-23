import { type FC, Suspense, lazy } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router';
import { Link } from 'react-router-dom';

import './auth.scss';
import {
	type NetworkSettingState,
	useAuthStore,
	useNetworkSettingState,
} from '../../../data';
import { ModalWrapper, NetworkSetingModal, Show } from '../../components';

const Logo = lazy(() => import('../../components/defaults/Logo'));

const AuthPage: FC = () => {
	const location = useLocation();
	const {
		isAuth,
		userData: { accessRole },
	} = useAuthStore((state) => state);
	const isAdmin = accessRole === 'admin';
	const { isOpen, setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);

	return !isAuth ? (
		<>
			<Show when={isOpen}>
				<ModalWrapper action={() => setNetworkSettingState(!isOpen)}>
					<div
						className="modal-wrapper-title internal-tables disable-border"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}>
						<div className="network-modal-container">
							<div className="network-modal-content disable-border">
								<NetworkSetingModal
									close={() => setNetworkSettingState(!isOpen)}
								/>
							</div>
						</div>
					</div>
				</ModalWrapper>
			</Show>
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
		<Navigate to={isAdmin ? '/admin' : '/'} />
	);
};

export default AuthPage;
