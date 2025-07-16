import { Suspense, useEffect, lazy, useMemo, useCallback } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { Loader } from '@/app/views/components/loaders/Loader.tsx';
import { FlashLightProvider } from '../../context/FlashLightContext.tsx';
import { WelcomeGroupTour } from '@/app/views/components/welcome/WelcomeGroupTour.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { QualityFeedbackManager } from '@modals/quality-survey/QualityFeedbackManager.tsx';
import { useProviderCompanies } from '@userHooks/providers/useProviderCompanies.ts';
import { useUserCommunicated } from '#commonUserHooks/useUserCommunicated.ts';
import useModal from '#commonHooks/useModal.ts';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { addEventListener, withBatchedUpdates } from '@utils/helper.ts';
import { EVENTS } from '@/app/constants/events.ts';
import WelcomeLoadResource from '@/app/views/components/welcome/WelcomeLoadResource/WelcomeLoadResource.tsx';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import { AddNewResourceModal } from '@modals/AddNewResourceModal/WelcomeResourcesOrderModel.tsx';
import { AddCollaboratorModal } from '@modals/adding-modals/AddCollaboratorModal.tsx';
import { OrderV2 } from '@modals/index.ts';
import { AxiosHttpService } from '@services/axiosHTTP.service.ts';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { ScanWraper } from '@/app/views/pages/panel/ScanWraper.tsx';

export const Navbar = lazy(() => import('../../components/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('../../components/sidebar/Sidebar.tsx'));
export const ErrorConnection = lazy(() => import('../../components/modals/ErrorConnection.tsx'));
export const MobileFallback = lazy(
  () => import('../../components/mobile-fallback/MobileFallback.tsx')
);

export const PanelPage = () => {
  const location = useLocation();
  const keyPress = useGlobalFastField('keyPress');
  const matches = useMediaQuery('(min-width: 1175px)');
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const { isAuth, getUserdata, logout } = useUserData();
  const { getProviderCompanyAccess } = useProviderCompanies();

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
    const errorUnsubscribe = addEventListener(window, EVENTS.ERROR_STATE, e => {
      setShowModal(true);
      setShowModalStr(MODAL_KEY_OPEN.ERROR_CONNECTION);
    });
    AxiosHttpService.getInstance().updateUrlInstance();
    const keydownUnsubscribe = addEventListener(
      window,
      EVENTS.KEYDOWN,
      withBatchedUpdates(e => {
        if (e.ctrlKey && e.altKey && e.key === 'ñ') {
          setShowModal(true);
          setShowModalStr(MODAL_KEY_OPEN.NETWORK_SETTING);
          e.stopImmediatePropagation();
          e.stopPropagation();
          return;
        }
        if (e.key === 'Escape') {
          keyPress.set('Escape');
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          return;
        }

        // No detenemos la propagación para otras teclas para permitir que lleguen a los inputs
      })
    );
    if (getUserdata()?.access_role === 'provider') {
      getProviderCompanyAccess();
    }
    return () => {
      errorUnsubscribe();
      keydownUnsubscribe();
      localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
    };
  }, []);

  // If not authenticated, redirect to login
  if (!isAuth) {
    // console.log('❌ PanelPage: User not authenticated, redirecting to signup', { isAuth, sessionExists: !!getUserdata(), currentPath: location.pathname });
    return <Navigate to="/auth/signup" state={{ redirect: location.pathname }} />;
  }

  // If screen width is below 1175px, show mobile fallback
  // if (!matches) {
  //   return <MobileFallback />;
  // }

  return (
    // <FlashLightProvider>
    <>
      {/* ✅ Solo renderizar modales cuando sean necesarios */}
      {modals.isNetworkSettingModalOpen && (
        <NetworkSettingModal
          isOpen={modals.isNetworkSettingModalOpen}
          close={() => setShowModal(false)}
        />
      )}

      {modals.isErrorConnectionModalOpen && (
        <Suspense fallback={null}>
          <ErrorConnection
            closeModal={closeErrorConnectionModal}
            open={modals.isErrorConnectionModalOpen}
          />
        </Suspense>
      )}

      {/* Modales que se renderizan condicionalmente según su lógica interna */}
      <WelcomeGroupTour />
      <QualityFeedbackManager />
      <WelcomeLoadResource />
      <AddNewResourceModal />
      <AddCollaboratorModal />
      <OrderV2 />
      <ModalReport />

      <Sidebar />

      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
      <ScanWraper />
    </>
    // </FlashLightProvider>
  );
};

export default PanelPage;
