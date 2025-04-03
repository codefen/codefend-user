import css from './prgressCircle.module.scss';

interface ProgressCircle {
  progress: number;
}

export const ProgressCircle = ({ progress }: ProgressCircle) => {
  return (
    <div className={css['progress-container']}>
      <div className={css['progress-content']}>
        <svg className={css['progress-svg']} viewBox="0 0 100 100">
          <circle
            className={`${css['progress-circle']} ${css['progress-gray']}`}
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          />
          <circle
            className={`${css['progress-circle']} ${css['progress-red']}`}
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
            style={{
              transformOrigin: 'center',
              transform: 'rotate(-90deg)',
            }}
          />
        </svg>
        <div className={css['progress-table']}>
          <span className={css['progress-number']}>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
