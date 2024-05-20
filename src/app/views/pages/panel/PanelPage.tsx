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
import { useUserHavePollActive } from '@hooks/quality-survey/useUserHavePollActive.ts';
import useModal from '#commonHooks/useModal.ts';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';

export const Navbar = lazy(() => import('@standalones/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('@standalones/sidebar/Sidebar.tsx'));
export const ErrorConection = lazy(() => import('@modals/ErrorConnection.tsx'));
export const MobileFallback = lazy(
	() => import('@defaults/mobile-fallback/MobileFallback.tsx'),
);

export const PanelPage: FC = () => {
	const location = useLocation();
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();
	const matches = useMediaQuery('(min-width: 1175px)');
	const { isAuth, logout, getUserdata } = useUserData();
	const { updateAuth } = useAuthStore((state) => state);
	const { getProviderCompanyAccess } = useProviderCompanies();
	useUserHavePollActive();
	if (!isAuth()) logout();

	useEffect(() => {
		updateAuth();
		const handleChange = () => {
			setShowModal(true);
			setShowModalStr('error');
		};
		const handleKeyDown = (e: any) => {
			if (e.ctrlKey && e.altKey && e.key === 'ñ') {
				setShowModal(true);
				setShowModalStr('network');
			}
		};
		window.addEventListener('errorState', handleChange);
		window.addEventListener('keydown', handleKeyDown);
		if (getUserdata().access_role === 'provider') {
			getProviderCompanyAccess();
		}
		return () => {
			window.removeEventListener('errorState', handleChange);
			window.removeEventListener('keydown', handleKeyDown);
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
						<NetworkSettingModal
							isOpen={showModal && showModalStr === 'network'}
							close={() => setShowModal(false)}
						/>
						<WelcomeGroupTour />
						<QualityFeedbackManager />

						<ErrorConection
							closeModal={() => {
								setShowModal(false);
								localStorage.removeItem('error');
							}}
							open={showModal && showModalStr === 'error'}
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
