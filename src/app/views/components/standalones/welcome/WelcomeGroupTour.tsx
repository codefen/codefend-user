import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useSolvedComunique } from '@hooks/useSolvedComunique.ts';
import { WelcomeDomain } from '@/app/components/WelcomeDomain/WelcomeDomain.tsx';
import { WelcomeScan } from '@/app/components/WelcomeScan/WelcomeScan.tsx';
import { WelcomeFinish } from '@/app/components/WelcomeFinish/WelcomeFinish.tsx';

export const WelcomeGroupTour = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const { solvedComunique } = useSolvedComunique();

  const startWaitStep = () => {
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
    solvedComunique();
  };

  const closeNormal = () => {
    setIsOpen(false);
    setModalId('');
    solvedComunique();
  };

  if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_DOMAIN) {
    return <WelcomeDomain close={startScan} />;
  } else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_SCAN) {
    return <WelcomeScan goToWaitStep={startWaitStep} close={close} />;
  } else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH) {
    return <WelcomeFinish close={closeNormal} solved={close} />;
  }
  return null;
};
