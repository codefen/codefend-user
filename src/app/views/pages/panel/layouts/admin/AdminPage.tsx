import { type FC, Suspense } from 'react';
import { AuthServices, useAuthState, useUserAdmin } from '../../../../../data';
import { Loader } from '../../../../components';
import { Navigate, Outlet } from 'react-router';
import './admin.scss';

const AdminPage: FC = () => {
	const { isAdmin, getAccessToken } = useUserAdmin();
	const { logout } = useAuthState();
	const isNotAuthenticated = AuthServices.verifyAuth();
	if (isNotAuthenticated) {
		logout();
	}

	const userHaveAccess =
		isAdmin() && getAccessToken() !== null && !isNotAuthenticated;
	return (
		<>
			{userHaveAccess ? (
				<Suspense fallback={<Loader />}>
					<Outlet />
				</Suspense>
			) : (
				<>
					<Navigate to={'/'} />
				</>
			)}
		</>
	);
};

export default AdminPage;
