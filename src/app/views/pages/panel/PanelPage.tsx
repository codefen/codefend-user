import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import {
	ErrorConection,
	Loader,
	Navbar,
	Show,
	Sidebar,
	SidebarResponsive,
} from '../../components';
import { useAuthStore } from '../../../data';

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
				<Show when={showModal}>
					<ErrorConection
						closeModal={() => {
							setShowModal(false);
							localStorage.removeItem('error');
						}}
					/>
				</Show>
				<div className=" xs:hidden sm:block">
					<Navbar />
				</div>
				<div>
					<SidebarResponsive />
				</div>
				<div className="flex">

					<div className="relative h-screen pt-6 mt-10 xs:hidden sm:block">
						<Sidebar />
					</div>

					<Suspense fallback={<Loader />}>
						<Outlet />
					</Suspense>
				</div>
				
			</>
		</Show>
	);
};
