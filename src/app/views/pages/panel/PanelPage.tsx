import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { Loader, Show } from '../../components';
import { AuthServices } from '../../../data';

const Navbar = lazy(() => import('../../components/standalones/navbar/Navbar'));
const Sidebar = lazy(
	() => import('../../components/standalones/sidebar/Sidebar'),
);
const ErrorConection = lazy(
	() => import('../../components/modals/ErrorConection'),
);

export const PanelPage: React.FC = () => {
	const isNotAuthenticated = AuthServices.verifyAuth();
	if (isNotAuthenticated) AuthServices.logout2();
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const handleChange = () => setShowModal(true);
		window.addEventListener('errorState', handleChange);

		return () => {
			window.removeEventListener('errorState', handleChange);
			localStorage.removeItem('error');
		};
	}, []);
	return (
		<Show
			when={!isNotAuthenticated}
			fallback={<Navigate to="/auth/signin" />}>
			<>
				<Show when={showModal}>
					<ErrorConection
						closeModal={() => {
							setShowModal(false);
							localStorage.removeItem('error');
						}}
					/>
				</Show>

				<Suspense fallback={<Loader />}>
					<Navbar />
					<Sidebar />
					<Outlet />
				</Suspense>
			</>
		</Show>
	);
};
