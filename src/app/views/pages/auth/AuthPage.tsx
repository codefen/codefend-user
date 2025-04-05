import { type FC, Suspense, lazy } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router';
import useAuthStore from '@stores/auth.store.ts';
import AuthNavigation from '../../components/AuthNavigation/AuthNavigation.tsx';
import ParticlesScriptLoader from '../../components/ParticlesScriptLoader/ParticlesScriptLoader.tsx';
import './auth.scss';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';

const BrandAndAppVersion = lazy(
  () => import('../../components/BrandAndAppVersion/BrandAndAppVersion.tsx')
);

const AuthPage: FC = () => {
  const location = useLocation();
  const { isAuth } = useAuthStore(state => state);
  if (isAuth) {
    return <Navigate to={'/'} />;
  }
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
