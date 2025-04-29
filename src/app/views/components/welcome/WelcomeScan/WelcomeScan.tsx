import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { ModalWrapper } from '@modals/index';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './welcomescan.module.scss';
import { PrimaryButton } from '@buttons/index';

export const WelcomeScan = ({
  close,
  goToWaitStep,
}: {
  close: () => void;
  goToWaitStep: () => void;
}) => {
  const { getCompany } = useUserData();
  const { initialDomain } = useWelcomeStore();

  const startScan = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    goToWaitStep();
  };

  return (
    <ModalWrapper showCloseBtn={false} action={close} type={css['welcome-modal-container']}>
      <div className='welcome-content ojo'>
        <img className='logose' src="/codefend/logo-color.png" width={220} />
        <p className={css['welcome-text']}>
          We're going to run an automated analysis on the selected domain.
          <b> Please confirm if you want to proceed with an automated analysis of <span style={{color: "#ff3939"}}>{initialDomain}</span>.
          </b>
        </p>
        <img src="/codefend/codefend-eye2.png" alt="Eye" className={css['scan-img']} />
        <div className="btn-container">
          <PrimaryButton text="close assistant" buttonStyle="gray" click={close} />
          <button className={`btn ${css['btn-add']}`} type="button" onClick={startScan}>
            Start IA based analysis
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default WelcomeScan;
