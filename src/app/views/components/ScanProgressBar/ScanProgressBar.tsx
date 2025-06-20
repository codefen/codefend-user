import css from './scanprogressbar.module.scss';

interface ScanProgressBarProps {
  progress: number;
  isCompleted?: boolean;
}

export const ScanProgressBar = ({ progress, isCompleted = false }: ScanProgressBarProps) => {
  return (
    <div className={css['scan-start-progress']}>
      <div 
        className={`${css['scan-start-progress-bar']} ${isCompleted ? css['completed'] : ''}`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
