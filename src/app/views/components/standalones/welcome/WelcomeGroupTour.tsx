import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useSolvedComunique } from '@hooks/useSolvedComunique.ts';
import { WelcomeDomain } from '@standalones/WelcomeDomain/WelcomeDomain';
import WelcomeScan from '@standalones/WelcomeScan/WelcomeScan';
import { WelcomeFinish } from '@standalones/WelcomeFinish/WelcomeFinish';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';

export const WelcomeGroupTour = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const { solvedComunique } = useSolvedComunique();
  const { getCompany } = useUserData();
  const { setScanRunning, setScanStep, domainId, setNeuroScanId } = useWelcomeStore();
  const [fetcher] = useFetcher();

  const startWaitStep = () => {
    const companyID = getCompany();
    solvedComunique();

    fetcher('post', {
      body: {
        model: 'modules/neuroscan/launch',
        resource_id: domainId,
        company_id: companyID,
      },
      requireSession: true,
      timeout: 15000,
    }).then(({ data }: any) => {
      setScanRunning(true);
      setNeuroScanId(data?.neuroscan?.id);
      setScanStep('scanner');
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
    });
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
