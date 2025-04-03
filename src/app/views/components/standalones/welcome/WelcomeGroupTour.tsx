import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useSolvedComunique } from '@hooks/useSolvedComunique.ts';
import { WelcomeDomain } from '@standalones/WelcomeDomain/WelcomeDomain';
import WelcomeScan from '@standalones/WelcomeScan/WelcomeScan';
import { WelcomeFinish } from '@standalones/WelcomeFinish/WelcomeFinish';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useAutoScan } from '@hooks/useAutoScan';

export const WelcomeGroupTour = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const { solvedComunique } = useSolvedComunique();
  const { domainId } = useWelcomeStore();
  const { autoScan } = useAutoScan();

  const startWaitStep = () => {
    solvedComunique();
    autoScan(domainId);
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
  };

  if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_DOMAIN) {
    return <WelcomeDomain close={startScan} />;
  } else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_SCAN) {
    return <WelcomeScan goToWaitStep={startWaitStep} close={close} />;
  } else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH) {
    return <WelcomeFinish solved={close} />;
  }
  return null;
};
