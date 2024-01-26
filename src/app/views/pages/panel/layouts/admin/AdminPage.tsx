import React, { Suspense } from 'react';
import { AuthServices, useUserAdmin } from '../../../../../data';
import { Loader, Navbar, Sidebar } from '../../../../components';
import { Navigate, Outlet } from 'react-router';
import { CompanyContextProvider } from './layouts/CompanyContext';

const AdminPage: React.FC = () => {
	const { isAdmin, getAccessToken } = useUserAdmin();
	const isNotAuthenticated = AuthServices.verifyAuth();
	if (isNotAuthenticated) {
		AuthServices.logout2();
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
