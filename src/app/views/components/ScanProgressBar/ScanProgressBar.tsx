import css from './scanprogressbar.module.scss';

export const ScanProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className={css['scan-start-progress']}>
      <div className={css[`scan-start-progress-bar`]} style={{ width: `${progress}%` }}></div>
    </div>
  );
};
