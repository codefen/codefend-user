import { STEPSDATA, type SignUpSteps } from '@/app/constants/newSignupText';
import css from './progressbar.module.scss';

export const ProgressBar = ({ activeStep }: { activeStep: SignUpSteps }) => {
  return (
    <div className={css['progressBarContainer']}>
      <div className={css['headerText']}>{<p>{STEPSDATA[activeStep]?.label}</p>}</div>
      <div className={css['progressBar']}>
        <div
          className={`${css['progressBarItem']} ${activeStep >= 1 ? css['progressBarItemActive'] : ''}`}></div>
        <div
          className={`${css['progressBarItem']} ${activeStep >= 2 ? css['progressBarItemActive'] : ''}`}></div>
        <div
          className={`${css['progressBarItem']} ${activeStep >= 3 ? css['progressBarItemActive'] : ''}`}></div>
        <div
          className={`${css['progressBarItem']} ${activeStep >= 4 ? css['progressBarItemActive'] : ''}`}></div>
      </div>
    </div>
  );
};
