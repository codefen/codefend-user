import React, { Suspense } from 'react';
import { AuthServices, useAuthStore, useUserAdmin } from '../../../../../data';
import { Loader, Navbar, Sidebar } from '../../../../components';
import { Navigate, Outlet } from 'react-router';
import { CompanyContextProvider } from './layouts/CompanyContext';
import './admin.scss';

const AdminPage: React.FC = () => {
	const { isAdmin, getAccessToken } = useUserAdmin();
	const { logout } = useAuthStore((state) => state);
	const isNotAuthenticated = AuthServices.verifyAuth();
	if (isNotAuthenticated) {
		logout();
	}

	const userHaveAccess =
		isAdmin() && getAccessToken() !== null && !isNotAuthenticated;
	return (
		<>
			{userHaveAccess ? (
				<CompanyContextProvider>
					<Suspense fallback={<Loader />}>
						<Outlet />
					</Suspense>
				</CompanyContextProvider>
			) : (
				<>
					<Navigate to={'/'} />
				</>
			)}
		</>
	);
};

export default AdminPage;
