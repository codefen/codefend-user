import { type FC, Suspense } from 'react';
import { useAuthState } from '#commonHooks/useAuthState.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { Loader } from '@defaults/loaders/Loader.tsx';
import { Navigate, Outlet } from 'react-router';

const AdminPage: FC = () => {
	const { isAdmin, getAccessToken } = useUserRole();
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
