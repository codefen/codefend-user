import { RadarScanner } from '../RadarScaner/RadarScaner';
import css from './dashboardinvoke.module.scss';
import { PrimaryButton } from '@buttons/index.ts';

export const DashboardInvoke = () => {
  return (
    <div className={css['leftTop']}>
      <RadarScanner />
      <div className={css['leftTopContent']}>
        <h1>Surface exploration in progress</h1>
        <p>
          We have not yet detected vulnerabilities or threats in their systems, but there is an
          automatic scan processing information, as soon as one is located, you and your team will
          be notified. <b> While waiting, let's add resources.</b>
        </p>
        <PrimaryButton
          text="add resources to calculate prices"
          buttonStyle="black"
          className="btn-black"
          click={() => {}}
          disabledLoader
        />
      </div>
    </div>
  );
};
