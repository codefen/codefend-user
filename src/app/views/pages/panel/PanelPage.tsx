import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import {
	ErrorConection,
	Loader,
	Navbar,
	Show,
	Sidebar,
	Header,
	SidebarResponsive
} from '../../components';
import { useAuthStore, usePanelStore } from '../../../data';

export const PanelPage: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const { isAuth, logout, updateAuth } = useAuthStore((state) => state);
	const { open } = usePanelStore();
	
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
				<div className="xs:hidden sm:block">
					<Navbar />
				</div>
				<div className='relative sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden'>
					<Header />
				</div>

				{/* <div
					className={`relative duration-300 md:hidden lg:hidden xl:hidden 2xl:hidden
					${!open ? 'w-16' : 'w-full'}`}>
					<Show when={open}>
						<SidebarResponsive />
					</Show>
				</div> */}
				<div className='relative sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden'>

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
