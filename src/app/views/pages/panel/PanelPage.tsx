import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../../data';
import {
	ErrorConection,
	Header,
	Loader,
	Navbar,
	Show,
	Sidebar,
	SidebarResponsive,
} from '../../components';
import { FlashLightProvider } from './FlashLightContext';
import { useMediaQuery } from 'usehooks-ts';

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

						{/* Desktop Resolution */}
						<div className={isSmallScreen ? 'hidden' : 'block'}>
							<Navbar />
							<Sidebar />
						</div>
					
						{/* Mobile Resolution */}
						<div className={isSmallScreen ? 'block' : 'hidden'}>
							<Header />
							<SidebarResponsive />
						</div>
						
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
