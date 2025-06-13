import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { ModalWrapper } from '@modals/index';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './welcomescan.module.scss';
import { PrimaryButton } from '@buttons/index';
import { IDIOM_SEARCHBAR_OPTION } from '@/app/constants/newSignupText';
import { Fragment } from 'react/jsx-runtime';
import { useState } from 'react';

export const WelcomeScan = ({
  close,
  goToWaitStep,
}: {
  close: () => void;
  goToWaitStep: (idiom: string) => void;
}) => {
  const { getCompany, user } = useUserData();
  const { initialDomain } = useWelcomeStore();
  const [idiom, setIdiom] = useState(user.get?.idiom || 'en');

  const startScan = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    goToWaitStep(idiom);
  };

  return (
    <ModalWrapper showCloseBtn={false} action={close} type={css['welcome-modal-container']}>
      <div className="welcome-content ojo">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <p className={css['welcome-text']}>
          We're going to run an automated analysis on the selected domain.
          <b>
            {' '}
            Please confirm if you want to proceed with an automated analysis of{' '}
            <span style={{ color: '#ff3939' }}>{initialDomain}</span>.
          </b>
        </p>
        <img src="/codefend/codefend-eye2.png" alt="Eye" className={css['scan-img']} />
        {/* Idiom selector temporarily hidden */}
        {/* <p className={css['idiom-text']}>Select the language of the analysis</p>
        <select
          className="search-select log-inputs"
          onChange={e => setIdiom(e.target.value)}
          value={idiom}>
          {Object.entries(IDIOM_SEARCHBAR_OPTION).map(([keyOption, value], i: number) => (
            <Fragment key={keyOption}>
              <option value={String(keyOption)}>{String(value)}</option>
            </Fragment>
          ))}
        </select> */}
        <div className="btn-container">
          <PrimaryButton text="Close assistant" buttonStyle="gray" click={close} />
          <button className={`btn ${css['btn-add']}`} type="button" onClick={startScan}>
            Start IA based analysis
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default WelcomeScan;
