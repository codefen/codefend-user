import type { FC, ReactNode } from 'react';

export interface StatAssetProps {
  value: ReactNode;
  valueTitle: string;
  isRed?: boolean;
  isActive?: boolean;
  borderStyle?: boolean;
  onClick?: () => void;
  trend?: string;
}

const sparkPath = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const points: string[] = [];
  for (let i = 0; i < 7; i++) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const x = (i / 6) * 64;
    const y = 4 + ((hash % 18) / 18) * 20;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${points.join(' L ')}`;
};

export const StatAsset: FC<StatAssetProps> = ({
  value,
  valueTitle,
  isRed,
  isActive,
  borderStyle,
  onClick,
  trend,
}) => {
  return (
    <div
      className={`card stat ${value == -1 ? 'skeleton-stat' : ''} ${isActive && 'stat-active'} ${!onClick && 'default'} ${borderStyle && 'border-stat'}`}
      onClick={onClick}>
      <div className={`value`}>{value}</div>
      <p className={`${isRed && 'codefend-text-red-200'}`}>{valueTitle}</p>
      <svg className="stat-spark" viewBox="0 0 64 22" aria-hidden="true" preserveAspectRatio="none">
        <path d={sparkPath(valueTitle)} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      {trend ? <span className="stat-trend">{trend}</span> : null}
    </div>
  );
};
