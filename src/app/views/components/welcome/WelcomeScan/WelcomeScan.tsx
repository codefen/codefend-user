import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { ModalWrapper } from '@modals/index';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './welcomescan.module.scss';

export const WelcomeScan = ({
  close,
  goToWaitStep,
}: {
  close: () => void;
  goToWaitStep: () => void;
}) => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const { domainId } = useWelcomeStore();

  const startScan = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        resource_id: domainId,
        company_id: companyID,
      },
      path: 'modules/neuroscan',
      requireSession: true,
    });

    goToWaitStep();
  };

  return (
    <ModalWrapper showCloseBtn={true} action={close} type={css['welcome-modal-container']}>
      <div>
        <img src="/codefend/brand-iso.png" width={350} height={60} />
        <p className={css['welcome-text']}>
          We're going to run an automated analysis on the selected domain.
          <b>
            Please confirm if you want to proceed with an automated analysis of mercadolibre.com.
          </b>
        </p>
        <img src="/codefend/scanner_eye_fullsize.png" alt="Eye" className={css['scan-img']} />
        <button className={`btn ${css['btn-add']}`} type="button" onClick={startScan}>
          Start scan
        </button>
      </div>
    </ModalWrapper>
  );
};

export default WelcomeScan;
