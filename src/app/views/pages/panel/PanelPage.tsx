import { type FC, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../../data';
import {
	ErrorConection,
	Loader,
	Navbar,
	Show,
	Sidebar,
} from '../../components';
import { FlashLightProvider } from './FlashLightContext';
import { WelcomeGroupTour } from '../../components/standalones/welcome/WelcomeGroupTour';
import { useMediaQuery } from 'usehooks-ts';
import { MobileFallback } from '@defaults/mobile-fallback/MobileFallback';
import '../../styles/flag.scss';
import { useUserData } from '#commonUserHooks/useUserData';

export const PanelPage: FC = () => {
	const [showModal, setShowModal] = useState(false);
	const matches = useMediaQuery('(min-width: 1200px)');
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
		<Show when={isAuth()} fallback={<Navigate to="/auth/signin" />}>
			<Show when={matches} fallback={<MobileFallback />}>
				<FlashLightProvider>
					<>
						<WelcomeGroupTour />
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
