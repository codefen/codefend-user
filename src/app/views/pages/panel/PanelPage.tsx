import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { Loader, Show } from '../../components';
import { useAuthStore } from '../../../data';
import { FlashLightProvider } from './FlashLightContext';

const Navbar = lazy(() => import('../../components/standalones/navbar/Navbar'));
const Sidebar = lazy(
	() => import('../../components/standalones/sidebar/Sidebar'),
);
const ErrorConection = lazy(
	() => import('../../components/modals/ErrorConection'),
);

export const PanelPage: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const { isAuth, logout, updateAuth } = useAuthStore((state) => state);
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
		<Show when={isAuth} fallback={<Navigate to="/auth/signin" />}>
			<>
				<FlashLightProvider>
					<>
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
			</>
		</Show>
	);
};
