import { ModalWrapper } from '@modals/index';
import css from './welcomefinish.module.scss';
import { scanStepnumber, scanStepText, ScanStepType } from '@/app/constants/welcome-steps';
import { ProgressCircle } from '@/app/views/components/ProgressCircle/ProgressCircle';
import { useScanProgress } from '@moduleHooks/neuroscan/useScanProgress';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useNavigate } from 'react-router';

export const WelcomeFinish = ({ solved }: { solved: () => void }) => {
  const globalStore = useGlobalFastFields(['scanProgress', 'isScanning', 'currentScan']);
  const navigate = useNavigate();

  const closeModal = () => {
    solved();
    if (!globalStore.isScanning.get) {
      navigate('/issues');
    }
  };
  const scanStep = (globalStore.currentScan.get?.phase as ScanStepType) || 'nonScan';

  return (
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']}>
      <div className="welcome-content">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <p className={css['welcome-text']}>
          <b>
            The domain{' '}
            <span style={{ color: '#ff3939' }}>
              {globalStore.currentScan.get?.resource_address}
            </span>
            . is being analyzed.
          </b>{' '}
          Detected vulnerabilities and potential threats will be displayed on the dashboard and
          communicated via email. <b>You can now close this window.</b>
        </p>

        <div>
          {globalStore.isScanning.get ? (
            <ProgressCircle progress={globalStore.scanProgress.get} />
          ) : (
            <div>
              <p>Termino capo, andate</p>
            </div>
          )}
        </div>

        <div className={css['finish-issues-found']}>
          <div className={css['finish-vuln-box']}>
            <div className={css['value']} style={{ color: '#e84f4f' }}>
              {globalStore.currentScan.get?.issues_found}
            </div>
            <span style={{ color: '#e84f4f' }}>Total finding</span>
          </div>
          <div className={css['finish-vuln-box']}>
            <div className={css['value']}>{globalStore.currentScan.get?.issues_parsed}</div>
            <span>Analizing finding</span>
          </div>
        </div>
        <div className={css['finish-text']}>
          <p>
            <b className={`${css['text-box']} ${css['svg-green']}`}>
              Current phase: {scanStepnumber[scanStep]}/{Object.keys(scanStepnumber)?.length - 2} -{' '}
              {scanStepText[scanStep]}
            </b>
          </p>
        </div>

        <PrimaryButton
          text={globalStore.isScanning.get ? 'Dashboard' : 'Go to issues'}
          buttonStyle="gray"
          click={closeModal}
        />
      </div>
    </ModalWrapper>
  );
};
