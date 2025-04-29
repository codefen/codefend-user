import { ModalWrapper } from '@modals/index';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './welcomefinish.module.scss';
import { scanStepnumber, scanStepText, ScanStepType } from '@/app/constants/welcome-steps';
import { ProgressCircle } from '@/app/views/components/ProgressCircle/ProgressCircle';
import { AlertIcons, CircleTicket, FileSearchIcon } from '@icons';
import { useEffect, useRef, useState } from 'react';
import { useScanProgress } from '@hooks/useScanProgress';
import { PrimaryButton } from '@buttons/index';

export const WelcomeFinish = ({ solved }: { solved: () => void }) => {
  const {
    initialDomain,
    scanStep,
    issueScanFound,
    issuesParsed,
    setFirstClose,
    setScanRunning,
    setScanStep,
  } = useWelcomeStore();
  const { progress } = useScanProgress();

  const closeModal = () => {
    setFirstClose(false);
    setScanRunning(true);
    setScanStep(ScanStepType.NonScan);
    solved();
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']}>
      <div className='welcome-content'>
      <img className='logose' src="/codefend/logo-color.png" width={220} />
        <p className={css['welcome-text']}>
          <b>The domain <span style={{color: "#ff3939"}}>{initialDomain}</span>. is being analyzed.</b> Detected vulnerabilities and
          potential threats will be displayed on the dashboard and communicated via email.{' '}
          <b>You can now close this window.</b>
        </p>

        <div>
          <ProgressCircle progress={progress} />
        </div>


        <div className={css['finish-issues-found']}>
          <div className={css['finish-vuln-box']}>
            <div className={css['value']}>{issueScanFound}</div>
            <span>Total finding</span>
          </div>
          <div className={css['finish-vuln-box']}>
            <div className={css['value']}>{issuesParsed}</div>
            <span>Analizing finding</span>
          </div>
        </div>
        <div className={css['finish-text']}>
          <p>
            <b className={`${css['text-box']} ${css['svg-green']}`}>
              Current phase: {scanStepnumber[scanStep]}/
              {Object.keys(scanStepnumber)?.length - 2} - {scanStepText[scanStep]}
            </b>
          </p>
        </div>        

        <PrimaryButton text="Dashboard" buttonStyle="gray" click={closeModal} />
      </div>
    </ModalWrapper>
  );
};
