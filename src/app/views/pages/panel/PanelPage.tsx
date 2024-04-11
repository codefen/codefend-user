import { type FC, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthState, useAuthStore } from '../../../data';
import {
	ErrorConection,
	Loader,
	Navbar,
	Show,
	Sidebar,
} from '../../components';
import { FlashLightProvider } from './FlashLightContext';
import { WelcomeGroupTour } from '../../components/standalones/welcome/WelcomeGroupTour';

export const PanelPage: FC = () => {
	const [showModal, setShowModal] = useState(false);
	const { updateAuth } = useAuthStore((state) => ({
		updateAuth: state.updateAuth,
	}));
	const { isAuth, logout } = useAuthState();

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

						<Navbar />
						<Sidebar />

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
