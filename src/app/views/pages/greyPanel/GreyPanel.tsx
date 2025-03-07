import { NewHeader } from '@/app/components/NewHeader/NewHeader';
import { FlashLightProvider } from '@/app/views/context/FlashLightContext';
import { Loader } from '@defaults/index';
import MobileFallback from '@/app/components/mobile-fallback/MobileFallback';
import useKeyEventPress from '@stores/keyEvents';
import { Suspense, useCallback, useEffect, useMemo } from 'react';
import { Outlet } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import useModal from '#commonHooks/useModal';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import ErrorConnection from '@modals/ErrorConnection';
import { EVENTS } from '@/app/constants/events';
import { addEventListener, withBatchedUpdates } from '@utils/helper.ts';
import { useProviderCompanies } from '@userHooks/providers/useProviderCompanies';
import { useUserData } from '#commonUserHooks/useUserData';
import { NetworkSettingModal } from '@modals/index';
import { QualityFeedbackManager } from '@modals/quality-survey/QualityFeedbackManager';
import { WelcomeGroupTour } from '@standalones/welcome/WelcomeGroupTour';
import { useUserCommunicated } from '@hooks/useUserCommunicated';
import { useVerifyScan } from '@hooks/useVerifyScan';

export const GreyPanel = () => {
  const { setKeyPress } = useKeyEventPress();
  const matches = useMediaQuery('(min-width: 1175px)');
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const { isAuth, getUserdata, updateAuth } = useUserData();
  const { getProviderCompanyAccess } = useProviderCompanies();
  useUserCommunicated();
  useVerifyScan();

  useEffect(() => {
    updateAuth();
    const errorUnsubscribe = addEventListener(window, EVENTS.ERROR_STATE, () => {
      setShowModal(true);
      setShowModalStr(MODAL_KEY_OPEN.ERROR_CONNECTION);
    });
    const keydownUnsubscribe = addEventListener(
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
    if (getUserdata()?.access_role === 'provider') {
      getProviderCompanyAccess();
    }
    return () => {
      errorUnsubscribe();
      keydownUnsubscribe();
      localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
    };
  }, []);

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

  if (!matches) {
    return <MobileFallback />;
  }
  return (
    <FlashLightProvider>
      <div>
        <ErrorConnection
          closeModal={closeErrorConnectionModal}
          open={modals.isErrorConnectionModalOpen}
        />
        {isAuth ? (
          <>
            <NetworkSettingModal
              isOpen={modals.isNetworkSettingModalOpen}
              close={() => setShowModal(false)}
            />
            <WelcomeGroupTour />
            <QualityFeedbackManager />
          </>
        ) : null}
        <NewHeader />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
    </FlashLightProvider>
  );
};
