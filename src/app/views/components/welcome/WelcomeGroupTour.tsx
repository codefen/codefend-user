import { useEffect } from 'react';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useSolvedComunique } from '@panelHooks/comunique/useSolvedComunique';
import { WelcomeDomain } from '@/app/views/components/welcome/WelcomeDomain/WelcomeDomain';
import WelcomeScan from '@/app/views/components/welcome/WelcomeScan/WelcomeScan';
import { WelcomeFinish } from '@/app/views/components/welcome/WelcomeFinish/WelcomeFinish';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useAutoScan } from '@moduleHooks/newscanner/useAutoScan';
import { useInitialDomainStore } from '@stores/initialDomain.store';

export const WelcomeGroupTour = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const { solvedComunique } = useSolvedComunique();
  const { autoScan } = useAutoScan();
  const { initialDomain } = useInitialDomainStore();

  // Auto-abrir scanner después del onboarding
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open_scanner') === 'true') {
      // Abrir automáticamente el scanner
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
      // Limpiar el parámetro URL
      const newURL = window.location.pathname;
      window.history.replaceState({}, document.title, newURL);
    }
  }, [setIsOpen, setModalId]);

  const startWaitStep = () => {
    return Promise.allSettled([solvedComunique(), autoScan(initialDomain, true, '')]).then(() => {
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
    });
  };

  const goToStartScanStep = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_SCAN);
  };

  const close = () => {
    setIsOpen(false);
    setModalId('');
    solvedComunique();
  };

  if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_DOMAIN) {
    return <WelcomeDomain close={close} goToStartScanStep={startWaitStep} />;
  }
  // else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_SCAN) {
  //   return <WelcomeScan goToWaitStep={startWaitStep} close={close} />;
  // }
  else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH) {
    return <WelcomeFinish solved={close} />;
  }
  return null;
};
