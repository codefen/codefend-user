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

						<div className="xs:hidden sm:block">
							<Navbar />
						</div>
						<div className="relative sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
							<Header />
						</div>
						<div className="relative sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
							<SidebarResponsive />
						</div>

						<Navbar />
						<div className="flex">
							<div className="relative h-screen pt-6 mt-[2rem] xs:hidden sm:block">
								<Sidebar />
							</div>

							<Suspense fallback={<Loader />}>
								<Outlet />
							</Suspense>
						</div>
					</>
				</FlashLightProvider>
			</Show>
		</>
	);
};
