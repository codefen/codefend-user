import { type FC, Suspense, useEffect, useState, lazy } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import useAuthStore from '@stores/auth.store.ts';
import Show from '@defaults/Show.tsx';
import { Loader } from '@defaults/loaders/Loader.tsx';
import { FlashLightProvider } from './FlashLightContext.tsx';
import { WelcomeGroupTour } from '@standalones/welcome/WelcomeGroupTour.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { QualityFeedbackManager } from '@modals/quality-survey/QualityFeedbackManager.tsx';
import '/public/flags/flags.css';
import { useProviderCompanies } from '@userHooks/providers/useProviderCompanies.ts';

export const Navbar = lazy(() => import('@standalones/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('@standalones/sidebar/Sidebar.tsx'));
export const ErrorConection = lazy(() => import('@modals/ErrorConection.tsx'));
export const MobileFallback = lazy(
	() => import('@defaults/mobile-fallback/MobileFallback.tsx'),
);

export const PanelPage: FC = () => {
	const location = useLocation();
	const [showModal, setShowModal] = useState(false);
	const matches = useMediaQuery('(min-width: 1175px)');
	const { isAuth, logout, getUserdata } = useUserData();
	const { updateAuth } = useAuthStore((state) => state);
	const { getProviderCompanyAccess } = useProviderCompanies();
	if (!isAuth) logout();

	useEffect(() => {
		updateAuth();
		const handleChange = () => setShowModal(true);
		window.addEventListener('errorState', handleChange);
		if (getUserdata().access_role === 'provider') {
			getProviderCompanyAccess();
		}
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

						<ErrorConection
							closeModal={() => {
								setShowModal(false);
								localStorage.removeItem('error');
							}}
							open={showModal}
						/>

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
