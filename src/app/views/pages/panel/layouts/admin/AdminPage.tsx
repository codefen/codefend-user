import { type FC, Suspense } from 'react';
import { Loader } from '@/app/views/components/loaders/Loader';
import { Outlet } from 'react-router';
import { useUserData } from '#commonUserHooks/useUserData';

const AdminPage: FC = () => {
  const { logout, getUserdata, isAuth } = useUserData();
  const isNotAuthenticated = !getUserdata() || !isAuth;
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
