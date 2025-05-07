import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { RadarScanner } from '@/app/views/components/RadarScaner/RadarScaner';
import { PrimaryButton } from '@buttons/index.ts';
import useModalStore from '@stores/modal.store';
import { useWelcomeStore } from '@stores/useWelcomeStore';

const getText = (scanNumber: number, disponibles: number) => {
  if (scanNumber === 0 && Number(disponibles) > 0) {
    return 'Your protection starts here.';
  }
  return 'Surface exploration in progress';
};

const getButtonText = (scanNumber: number, disponibles: number) => {
  if (scanNumber === 0 && Number(disponibles) > 0) {
    return 'Start scan';
  }
  return 'Open scan progress';
};

const getDescription = (scanNumber: number, disponibles: number) => {
  if (scanNumber === 0 && Number(disponibles) > 0) {
    return (
      <>
        Our AI-powered engine is ready to scan your resources and uncover hidden threats before they
        strike. Don’t wait for a breach —{' '}
        <b>launch your first smart scan now and stay ahead of cyber risks.</b>
      </>
    );
  }
  return (
    <>
      Our AI is thoroughly analyzing your resources to detect hidden vulnerabilities and security
      gaps. This process may take a little while — you can follow the scan’s progress in real time.
      In the meantime, feel free to explore other features while we work in the background.
    </>
  );
};

export const DashboardInvoke = ({
  scanNumber,
  disponibles,
}: {
  scanNumber: number;
  disponibles: any;
}) => {
  const { setIsOpen, setModalId } = useModalStore();
  const { setScanStep, setIssueFound, setIssuesViewed, setScanRunning } = useWelcomeStore();

  const openOnBoard = () => {
    if (scanNumber === 0) {
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
      setScanStep(ScanStepType.NonScan);
      setIssueFound(0);
      setIssuesViewed(0);
      setScanRunning(false);
    } else {
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
    }
    setIsOpen(true);
  };
  return (
    <div className="card rectangle">
      <div className="over">
        <RadarScanner />
        <div className="header-content">
          <h1>{getText(scanNumber, disponibles)}</h1>
          <p>{getDescription(scanNumber, disponibles)}</p>
          <PrimaryButton
            text={getButtonText(scanNumber, disponibles)}
            buttonStyle="black"
            className="btn-black"
            click={openOnBoard}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
