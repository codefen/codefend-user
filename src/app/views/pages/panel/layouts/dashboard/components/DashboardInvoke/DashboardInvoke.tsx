import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { RadarScanner } from '@/app/views/components/RadarScaner/RadarScaner';
import { PrimaryButton } from '@buttons/index.ts';
import useModalStore from '@stores/modal.store';
import { useWelcomeStore } from '@stores/useWelcomeStore';

const scanContent = {
  idle: {
    title: 'Your protection starts here.',
    button: 'Start scan',
    description: (
      <>
        Our AI-powered engine is ready to scan your resources and uncover hidden threats before they
        strike. Don’t wait for a breach —{' '}
        <b>launch your first smart scan now and stay ahead of cyber risks.</b>
      </>
    ),
    modalId: MODAL_KEY_OPEN.USER_WELCOME_DOMAIN,
    scanStep: ScanStepType.NonScan,
    issueFound: 0,
    issuesViewed: 0,
    scanRunning: false,
  },
  scanning: {
    title: 'Surface exploration in progress',
    button: 'Open scan progress',
    description: (
      <>
        Our AI is carefully analyzing your resources to find hidden vulnerabilities and security
        gaps. This might take a few moments. You can track the scan's progress in real time, and
        feel free to explore other features while we work in the background.
      </>
    ),
    modalId: MODAL_KEY_OPEN.USER_WELCOME_FINISH,
  },
};

export const DashboardInvoke = ({
  isScanning,
  openScan,
}: {
  isScanning: boolean;
  openScan: () => void;
}) => {
  const { setIsOpen, setModalId } = useModalStore();
  const { setScanStep, setIssueFound, setIssuesViewed, setScanRunning } = useWelcomeStore();
  const state = isScanning ? scanContent.scanning : scanContent.idle;
  const openOnBoard = () => {
    if (!isScanning) {
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
      setScanStep(ScanStepType.NonScan);
      setIssueFound(0);
      setIssuesViewed(0);
      setScanRunning(false);
      setIsOpen(true);
    } else {
      openScan();
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
      setIsOpen(true);
    }
  };
  return (
    <div className="card rectangle">
      <div className="over">
        <RadarScanner />
        <div className="header-content">
          <h1>{state.title}</h1>
          <p>{state.description}</p>
          <PrimaryButton
            text={state.button}
            buttonStyle="red"
            className="btn-black btn-mobile-small"
            click={openOnBoard}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
