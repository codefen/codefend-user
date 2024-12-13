import { type FC, Suspense, lazy } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router';
import useAuthStore from '@stores/auth.store.ts';
import AuthNavigation from '../../components/auth/AuthNavigation';
import ParticlesScriptLoader from '../../components/auth/ParticlesScriptLoader';
import './auth.scss';
import { PageLoader } from '@defaults/loaders/Loader.tsx';

const BrandAndAppVersion = lazy(() => import('../../components/auth/BrandAndAppVersion.tsx'));

const AuthPage: FC = () => {
  const location = useLocation();
  const { isAuth } = useAuthStore(state => state);
  if (isAuth) {
    return <Navigate to={'/'} />;
  }
  console.log('New update');
  return (
    <>
      <ParticlesScriptLoader />
      <section className="access">
        <div className="forms">
          <AuthNavigation location={location.pathname} />
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>

        <BrandAndAppVersion />

        <div className="bkg"></div>
      </section>
    </>
  );
};

export default AuthPage;
