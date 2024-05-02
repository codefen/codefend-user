import { type FC, Suspense, useEffect, useState, lazy } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import useAuthStore from '@stores/auth.store.ts';
import Show from '@defaults/Show.tsx';
import ErrorConection from '@modals/ErrorConection.tsx';
import { Loader } from '@defaults/loaders/Loader.tsx';
import { FlashLightProvider } from './FlashLightContext.tsx';
import { WelcomeGroupTour } from '@standalones/welcome/WelcomeGroupTour.tsx';
import { MobileFallback } from '@defaults/mobile-fallback/MobileFallback.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { QualityFeedbackManager } from '@modals/quality-survey/QualityFeedbackManager.tsx';
import '/public/flags/flags.css';

export const Navbar = lazy(() => import('@standalones/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('@standalones/sidebar/Sidebar.tsx'));

export const PanelPage: FC = () => {
	const location = useLocation();
	const [showModal, setShowModal] = useState(false);
	const matches = useMediaQuery('(min-width: 1175px)');
	const { updateAuth } = useAuthStore((state) => ({
		updateAuth: state.updateAuth,
	}));
	const { isAuth, logout } = useUserData();
	if (!isAuth) logout();

	useEffect(() => {
		updateAuth();
		const handleChange = () => setShowModal(true);
		window.addEventListener('errorState', handleChange);

		return () => {
			window.removeEventListener('errorState', handleChange);
			localStorage.removeItem('error');
		};
	}, []);

	return (
		<Show
			when={isAuth()}
			fallback={
				<Navigate
					to="/auth/signin"
					state={{ redirect: location.pathname }}
				/>
			}>
			<Show when={matches} fallback={<MobileFallback />}>
				<FlashLightProvider>
					<>
						<WelcomeGroupTour />
						<QualityFeedbackManager />
						<Show when={showModal}>
							<ErrorConection
								closeModal={() => {
									setShowModal(false);
									localStorage.removeItem('error');
								}}
							/>
						</Show>

						<Navbar />
						<Sidebar />

						<Suspense fallback={<Loader />}>
							<Outlet />
						</Suspense>
					</>
				</FlashLightProvider>
			</Show>
		</Show>
	);
};

export default PanelPage;
