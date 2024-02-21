import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { useAuthStore } from '../../../data';
import {
	ErrorConection,
	Loader,
	Navbar,
	Show,
	Sidebar,
	SidebarResponsive,
	NavResponsive,
	HeaderResponsive
} from '../../components';
import { FlashLightProvider } from './FlashLightContext';

export const PanelPage: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const { isAuth, logout, updateAuth } = useAuthStore((state) => state);
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
			<Show when={isAuth} fallback={<Navigate to="/auth/signin" />}>
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
