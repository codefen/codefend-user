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
import { useUserCommunicated } from '@hooks/useUserCommunicated.ts';
import useModal from '#commonHooks/useModal.ts';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';

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
	useUserCommunicated();
	if (!isAuth()) logout();

	useEffect(() => {
		updateAuth();
		const handleChange = () => {
			setShowModal(true);
			setShowModalStr(MODAL_KEY_OPEN.ERROR_CONNECTION);
		};
		const handleKeyDown = (e: any) => {
			if (e.ctrlKey && e.altKey && e.key === 'ñ') {
				setShowModal(true);
				setShowModalStr(MODAL_KEY_OPEN.NETWORK_SETTING);
			}
		};
		window.addEventListener(MODAL_KEY_OPEN.ERROR_STATE, handleChange);
		window.addEventListener('keydown', handleKeyDown);
		if (getUserdata().access_role === 'provider') {
			getProviderCompanyAccess();
		}
		return () => {
			window.removeEventListener(MODAL_KEY_OPEN.ERROR_STATE, handleChange);
			window.removeEventListener('keydown', handleKeyDown);
			localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
		};
	}, []);

	//REMPLAZAR (EN EL PRIMER SHOW) CUANDO SE TERMINE DE PROBAR
	//true -> isAuth()
	//REMPLAZAR EN (EL SEGUNDO SHOW)
	//true -> matches

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
							isOpen={
								showModal &&
								showModalStr === MODAL_KEY_OPEN.NETWORK_SETTING
							}
							close={() => setShowModal(false)}
						/>
						<WelcomeGroupTour />
						<QualityFeedbackManager />

						<ErrorConection
							closeModal={() => {
								setShowModal(false);
								localStorage.removeItem(
									MODAL_KEY_OPEN.ERROR_CONNECTION,
								);
							}}
							open={
								showModal &&
								showModalStr === MODAL_KEY_OPEN.ERROR_CONNECTION
							}
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
