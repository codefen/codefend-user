import { type FC, Suspense } from 'react';
import { useAuthState } from '#commonHooks/useAuthState.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { Loader } from '@defaults/loaders/Loader.tsx';
import { Navigate, Outlet } from 'react-router';

const AdminPage: FC = () => {
	const { logout, getUserdata, isAuth } = useAuthState();
	const isNotAuthenticated = !getUserdata() || !isAuth();
	if (isNotAuthenticated) {
		logout();
	}
	return (
		<Suspense fallback={<Loader />}>
			<Outlet />
		</Suspense>
	);
};

export default AdminPage;
