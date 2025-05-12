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

export const WelcomeFinish = ({ solved }: { solved: () => void }) => {
  const globalStore = useGlobalFastFields(['scanProgress', 'isScanning', 'currentScan']);
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
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']}>
      <div className="welcome-content">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <Show when={scanStep != ScanStepType.NonScan} fallback={<PageLoader />}>
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
              <span style={{ color: '#e84f4f' }}>Total finding</span>
            </div>
            <div
              className={`${css['finish-vuln-box']} ${!globalStore.isScanning.get ? css['vul-box-complete'] : ''}`}>
              <div className={`${css['value']} ${css['stat-complete']}`}>
                {globalStore.currentScan.get?.issues_parsed}
              </div>
              <span>{!globalStore.isScanning.get ? 'Analyzed finding' : 'Analizing finding'}</span>
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
            text={globalStore.isScanning.get ? 'Dashboard' : 'Go to issues'}
            buttonStyle="gray"
            click={closeModal}
          />
        </Show>
      </div>
    </ModalWrapper>
  );
};
