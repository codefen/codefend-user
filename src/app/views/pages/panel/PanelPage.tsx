import { Suspense, useEffect, lazy, useMemo, useCallback } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { Loader } from '@defaults/loaders/Loader.tsx';
import { FlashLightProvider } from '../../context/FlashLightContext.tsx';
import { WelcomeGroupTour } from '@standalones/welcome/WelcomeGroupTour.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { QualityFeedbackManager } from '@modals/quality-survey/QualityFeedbackManager.tsx';
import '/public/flags/flags.css';
import { useProviderCompanies } from '@userHooks/providers/useProviderCompanies.ts';
import { useUserCommunicated } from '@hooks/useUserCommunicated.ts';
import useModal from '#commonHooks/useModal.ts';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { addEventListener, withBatchedUpdates } from '@utils/helper.ts';
import { EVENTS } from '@/app/constants/events.ts';
import useKeyEventPress from '@stores/keyEvents.ts';

export const Navbar = lazy(() => import('@standalones/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('@standalones/sidebar/Sidebar.tsx'));
export const ErrorConection = lazy(() => import('@modals/ErrorConnection.tsx'));
export const MobileFallback = lazy(() => import('@defaults/mobile-fallback/MobileFallback.tsx'));

export const PanelPage = () => {
  const location = useLocation();
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const { setKeyPress } = useKeyEventPress();
  const matches = useMediaQuery('(min-width: 1175px)');
  const { isAuth, logout, getUserdata, updateAuth } = useUserData();
  const { getProviderCompanyAccess } = useProviderCompanies();
  useUserCommunicated();

  const modals = useMemo(
    () => ({
      isNetworkSettingModalOpen: showModal && showModalStr === MODAL_KEY_OPEN.NETWORK_SETTING,
      isErrorConnectionModalOpen: showModal && showModalStr === MODAL_KEY_OPEN.ERROR_CONNECTION,
    }),
    [showModal, showModalStr]
  );

  const closeErrorConnectionModal = useCallback(() => {
    setShowModal(false);
    localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
  }, [setShowModal]);

  useEffect(() => {
    updateAuth();
    const errorUnsub = addEventListener(window, EVENTS.ERROR_STATE, () => {
      setShowModal(true);
      setShowModalStr(MODAL_KEY_OPEN.ERROR_CONNECTION);
    });
    const keydownUnsub = addEventListener(
      window,
      EVENTS.KEYDOWN,
      withBatchedUpdates(e => {
        if (e.ctrlKey && e.altKey && e.key === 'ñ') {
          setShowModal(true);
          setShowModalStr(MODAL_KEY_OPEN.NETWORK_SETTING);
        }
        if (e.key === 'Escape') {
          setKeyPress('Escape');
          e.preventDefault();
        }

        e.stopImmediatePropagation();
        e.stopPropagation();
      })
    );
    if (getUserdata().access_role === 'provider') {
      getProviderCompanyAccess();
    }
    return () => {
      errorUnsub();
      keydownUnsub();
      localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
    };
  }, []);

  // Si la autenticacion fallo redirige al login
  if (!isAuth) {
    logout();
    return <Navigate to="/auth/signin" state={{ redirect: location.pathname }} />;
  }
  // Si la resolucion esta por debajo de 1175px, muestra alerta de mobile version
  if (!matches) {
    return <MobileFallback />;
  }

  return (
    <FlashLightProvider>
      <>
        <NetworkSettingModal
          isOpen={modals.isNetworkSettingModalOpen}
          close={() => setShowModal(false)}
        />
        <WelcomeGroupTour />
        <QualityFeedbackManager />

        <ErrorConection
          closeModal={closeErrorConnectionModal}
          open={modals.isErrorConnectionModalOpen}
        />

        <Navbar />
        <Sidebar />

        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </>
    </FlashLightProvider>
  );
};

export default PanelPage;
