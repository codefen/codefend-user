import { type FC, Suspense } from 'react';
import { useAuthState, useUserAdmin } from '../../../../../data';
import { Loader } from '../../../../components';
import { Navigate, Outlet } from 'react-router';
import './admin.scss';

const AdminPage: FC = () => {
	const { isAdmin, getAccessToken } = useUserAdmin();
	const { logout, getUserdata, isAuth } = useAuthState();
	const isNotAuthenticated = !getUserdata() || !isAuth();
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
