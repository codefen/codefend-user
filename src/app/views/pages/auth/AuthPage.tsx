import { type FC, Suspense, lazy } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router';
import AuthNavigation from '../../components/AuthNavigation/AuthNavigation.tsx';
import ParticlesScriptLoader from '../../components/ParticlesScriptLoader/ParticlesScriptLoader.tsx';
import './auth.scss';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';

const BrandAndAppVersion = lazy(
  () => import('../../components/BrandAndAppVersion/BrandAndAppVersion.tsx')
);

const AuthPage: FC = () => {
  const location = useLocation();
  const { isAuth } = useUserData();
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
