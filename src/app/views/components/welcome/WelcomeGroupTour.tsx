import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useSolvedComunique } from '@panelHooks/comunique/useSolvedComunique';
import { WelcomeDomain } from '@/app/views/components/welcome/WelcomeDomain/WelcomeDomain';
import WelcomeScan from '@/app/views/components/welcome/WelcomeScan/WelcomeScan';
import { WelcomeFinish } from '@/app/views/components/welcome/WelcomeFinish/WelcomeFinish';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useAutoScan } from '@moduleHooks/neuroscan/useAutoScan';

export const WelcomeGroupTour = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const { solvedComunique } = useSolvedComunique();
  const { domainId, saveInitialDomain } = useWelcomeStore();
  const { autoScan } = useAutoScan();

  const startWaitStep = () => {
    solvedComunique();
    autoScan(domainId, true, '');
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
  };
  const startScan = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_SCAN);
  };

  const close = () => {
    setIsOpen(false);
    setModalId('');
    saveInitialDomain('');
    solvedComunique();
  };

  if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_DOMAIN) {
    return <WelcomeDomain close={close} startScan={startScan} />;
  } else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_SCAN) {
    return <WelcomeScan goToWaitStep={startWaitStep} close={close} />;
  } else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH) {
    return <WelcomeFinish solved={close} />;
  }
  return null;
};
