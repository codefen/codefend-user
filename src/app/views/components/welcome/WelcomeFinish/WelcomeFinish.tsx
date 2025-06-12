import { ModalWrapper } from '@modals/index';
import css from './welcomefinish.module.scss';
import { scanStepnumber, scanStepText, ScanStepType } from '@/app/constants/welcome-steps';
import { ProgressCircle } from '@/app/views/components/ProgressCircle/ProgressCircle';
import { useScanProgress } from '@moduleHooks/neuroscan/useScanProgress';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useNavigate } from 'react-router';
import { CheckSimpleIcon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';

export const WelcomeFinish = ({ solved }: { solved: () => void }) => {
  const globalStore = useGlobalFastFields([
    'scanProgress',
    'isScanning',
    'currentScan',
    'autoScanState',
  ]);
  const { initialDomain } = useWelcomeStore();
  const navigate = useNavigate();

  const closeModal = () => {
    solved();
    if (!globalStore.isScanning.get) {
      navigate('/issues');
    }
  };
  const scanStep = (globalStore.currentScan.get?.phase as ScanStepType) || ScanStepType.NonScan;

  return (
    <ModalWrapper showCloseBtn={true} type={css['welcome-modal-container']} action={solved}>
      <div className="welcome-content">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <Show
          when={
            globalStore.isScanning.get ||
            globalStore.autoScanState.get == AUTO_SCAN_STATE.SCAN_LAUNCHED ||
            globalStore.autoScanState.get == AUTO_SCAN_STATE.SCAN_FINISHED
          }
          fallback={<PageLoader />}>
          <p className={css['welcome-text']}>
            <b>
              The domain{' '}
              <span style={{ color: '#ff3939' }}>
                {globalStore.currentScan.get?.resource_address}
              </span>{' '}
              is being analyzed.
            </b>{' '}
            Detected vulnerabilities and potential threats will be displayed on the dashboard and
            communicated via email. <b>You can now close this window.</b>
          </p>

          <div>
            {globalStore.isScanning.get ? (
              <ProgressCircle progress={globalStore.scanProgress.get} />
            ) : (
              <div
                className={`${css['completion-container']} ${!globalStore.isScanning.get ? css['active'] : ''}`}>
                <div
                  className={`${css['check-circle']} ${!globalStore.isScanning.get ? css['active'] : ''}`}>
                  <div
                    className={`${css['check-icon']} ${!globalStore.isScanning.get ? css['active'] : ''}`}>
                    <CheckSimpleIcon />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={css['finish-issues-found']}>
            <div className={css['finish-vuln-box']}>
              <div className={`${css['value']} ${css['stat-complete']}`}>
                {globalStore.currentScan.get?.issues_found}
              </div>
              <span style={{ color: '#e84f4f' }}>Total findings</span>
            </div>
            <div
              className={`${css['finish-vuln-box']} ${!globalStore.isScanning.get ? css['vul-box-complete'] : ''}`}>
              <div className={`${css['value']} ${css['stat-complete']}`}>
                {globalStore.currentScan.get?.issues_parsed}
              </div>
              <span>Analyzed findings</span>
            </div>
          </div>
          <div className={css['finish-text']}>
            <p>
              <b className={`${css['text-box']} ${css['svg-green']}`}>
                Current phase: {scanStepnumber[scanStep]}/{Object.keys(scanStepnumber)?.length - 2}{' '}
                - {scanStepText[scanStep]}
              </b>
            </p>
          </div>

          <PrimaryButton
            text={globalStore.isScanning.get ? 'Close assistant' : 'Go to issues'}
            buttonStyle={globalStore.isScanning.get ? 'red' : 'black'}
            click={closeModal}
          />
        </Show>
      </div>
    </ModalWrapper>
  );
};
