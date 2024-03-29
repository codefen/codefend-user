import { type FC, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { useAuthState, useAuthStore } from '../../../data';
import {
	ErrorConection,
	Loader,
	Navbar,
	Show,
	Sidebar,
	SidebarResponsive,
	NavResponsive,
	HeaderResponsive,
} from '../../components';
import { FlashLightProvider } from './FlashLightContext';
import { WelcomeGroupTour } from '../../components/standalones/welcome/WelcomeGroupTour';

export const PanelPage: FC = () => {
	const [showModal, setShowModal] = useState(false);
	const { updateAuth } = useAuthStore((state) => ({
		updateAuth: state.updateAuth,
	}));
	const { isAuth, logout } = useAuthState();
	const isSmallScreen = useMediaQuery('(max-width: 640px)');

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
		<>
			<Show when={isAuth()} fallback={<Navigate to="/auth/signin" />}>
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

						{!isSmallScreen ? (
							<>
								<Navbar />
								<Sidebar />
							</>
						) : (
							<>
								<HeaderResponsive />
								<SidebarResponsive />
								<NavResponsive />
							</>
						)}

						<Suspense fallback={<Loader />}>
							<Outlet />
						</Suspense>
					</>
				</FlashLightProvider>
			</Show>
		</>
	);
};

export default PanelPage;
