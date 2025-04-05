import { useEffect, useState } from 'react';
import css from './progressCircle.module.scss';

interface ProgressCircle {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressCircle = ({ progress, size = 100, strokeWidth = 11 }: ProgressCircle) => {
  const [offset, setOffset] = useState(0);
  const padding = strokeWidth + 8;
  const adjustedSize = size + padding * 2;
  const center = adjustedSize / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = circumference * (1 - progress / 100);
    setOffset(progressOffset);
  }, [progress, circumference]);

  return (
    <div className={css['progress-container']}>
      <div className={css['progress-content']}>
        <svg className={css['progress-svg']} viewBox={`0 0 ${adjustedSize} ${adjustedSize}`}>
          <defs>
            <linearGradient id="progressGradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="90 0.5 0.5"
                to="450 0.5 0.5"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Círculo de fondo */}
          <circle
            className={`${css['progress-circle']} ${css['progress-gray']}`}
            strokeWidth={strokeWidth}
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
          />
          {/* Círculo de progreso animado */}
          <circle
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transformOrigin: 'center',
              transform: 'rotate(-90deg)',
              filter: 'url(#glow)',
            }}
          />
          {/* Pequeños puntos que se mueven a lo largo del círculo */}
          <circle r={strokeWidth / 4} fill="#f87171" filter="url(#glow)">
            <animateMotion
              path={`M ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center}`}
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>

          <circle r={strokeWidth / 5} fill="#fecaca" filter="url(#glow)">
            <animateMotion
              path={`M ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center}`}
              dur="2s"
              begin="1.25s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>
        </svg>
        <div className={css['progress-table']}>
          <span className={css['progress-number']}>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
