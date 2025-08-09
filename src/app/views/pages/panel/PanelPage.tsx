import { Suspense, useEffect, lazy, useMemo, useCallback, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { Loader } from '@/app/views/components/loaders/Loader.tsx';
import { FlashLightProvider } from '../../context/FlashLightContext.tsx';
import { WelcomeGroupTour } from '@/app/views/components/welcome/WelcomeGroupTour.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { QualityFeedbackManager } from '@modals/quality-survey/QualityFeedbackManager.tsx';
import { useProviderCompanies } from '@userHooks/providers/useProviderCompanies.ts';
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
// Import useUserCommunicated ONLY for UserCommunicationManager
import { useUserCommunicated } from '#commonUserHooks/useUserCommunicated.ts';

export const Navbar = lazy(() => import('../../components/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('../../components/sidebar/Sidebar.tsx'));
export const ErrorConnection = lazy(() => import('../../components/modals/ErrorConnection.tsx'));
export const MobileFallback = lazy(
  () => import('../../components/mobile-fallback/MobileFallback.tsx')
);

// Component that handles user communications when session is ready
const UserCommunicationManager = () => {
  // const { getUserdata, getCompany, isAuth } = useUserData();

  // console.log('📢 UserCommunicationManager: Initializing user communication hook', {
  //   isAuth,
  //   hasUserData: !!getUserdata(),
  //   userId: getUserdata()?.id,
  //   companyId: getCompany(),
  //   timestamp: new Date().toISOString(),
  // });

  // This hook will only execute when this component is rendered (when sessionReady=true)
  useUserCommunicated();

  // console.log('📢 UserCommunicationManager: useUserCommunicated hook executed', {
  //   timestamp: new Date().toISOString(),
  // });

  return null;
};

export const PanelPage = () => {
  const location = useLocation();
  const keyPress = useGlobalFastField('keyPress');
  const matches = useMediaQuery('(min-width: 1175px)');
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const { isAuth, getUserdata, logout } = useUserData();
  const { getProviderCompanyAccess } = useProviderCompanies();
  const [sessionReady, setSessionReady] = useState(false);

  // console.log('🏠 PanelPage: Rendering with auth state', {
  //   isAuth,
  //   hasUserData: !!getUserdata(),
  //   userId: getUserdata()?.id,
  //   sessionReady,
  //   currentPath: location.pathname,
  //   timestamp: new Date().toISOString(),
  // });

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
    // console.log('🔧 PanelPage: Setting up event listeners and initial setup', {
    //   timestamp: new Date().toISOString(),
    // });

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

    // Add delay to ensure session is fully established
    const checkSessionReady = () => {
      const loginTimestamp = localStorage.getItem('last_login_timestamp');
      const now = Date.now();
      const timeSinceLogin = loginTimestamp ? now - parseInt(loginTimestamp) : Infinity;

      // console.log('🕒 PanelPage: Checking session readiness', {
      //   loginTimestamp,
      //   timeSinceLogin,
      //   hasUserData: !!getUserdata(),
      //   isAuth,
      //   timestamp: new Date().toISOString(),
      // });

      // If login was recent (less than 2 seconds ago), wait a bit more
      if (timeSinceLogin < 2000) {
        // console.log('⏰ PanelPage: Recent login detected, waiting for session to stabilize', {
        //   timeSinceLogin,
        //   timestamp: new Date().toISOString(),
        // });
        setTimeout(() => {
          // console.log('✅ PanelPage: Session should be ready now', {
          //   hasUserData: !!getUserdata(),
          //   isAuth,
          //   sessionExists: !!getUserdata(),
          //   timeSinceStartup: Date.now() - parseInt(loginTimestamp || '0'),
          //   timestamp: new Date().toISOString(),
          // });
          setSessionReady(true);
        }, 1500); // Increased to 1.5 seconds for more stability
      } else {
        // console.log('✅ PanelPage: Session ready immediately', {
        //   timeSinceLogin,
        //   hasUserData: !!getUserdata(),
        //   isAuth,
        //   timestamp: new Date().toISOString(),
        // });
        setSessionReady(true);
      }
    };

    checkSessionReady();

    return () => {
      errorUnsubscribe();
      keydownUnsubscribe();
      localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
    };
  }, []);

  // Debug sessionReady changes
  useEffect(() => {
    console.log('🎯 PanelPage: sessionReady changed', {
      timestamp: new Date().toISOString(),
    });
  }, [sessionReady]);

  // If not authenticated, redirect to login
  if (!isAuth) {
    // console.log('❌ PanelPage: User not authenticated, redirecting to signup', {
    //   isAuth,
    //   sessionExists: !!getUserdata(),
    //   currentPath: location.pathname,
    //   timestamp: new Date().toISOString(),
    // });
    return <Navigate to="/auth/signup" state={{ redirect: location.pathname }} />;
  }

  // Show loading while session is not ready
  // if (!sessionReady) {
  //   console.log('⏳ PanelPage: Session not ready, showing loading', {
  //     sessionReady,
  //     isAuth,
  //     hasUserData: !!getUserdata(),
  //     timestamp: new Date().toISOString(),
  //   });
  // }

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

      {/* Render components that make API calls only when session is ready */}
      {sessionReady ? (
        <>
          {/* User communication manager that includes useUserCommunicated hook */}
          <UserCommunicationManager />
          {/* Components that depend on API calls and could cause session issues */}
          <WelcomeGroupTour />
          <QualityFeedbackManager />
          <WelcomeLoadResource />
          <AddNewResourceModal />
          <AddCollaboratorModal />
          <OrderV2 />
          <ModalReport />
        </>
      ) : (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}>
            <div>Initializing session...</div>
            <Loader />
          </div>
        </div>
      )}

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
