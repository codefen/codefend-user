import type { FC, ReactNode } from 'react';

export interface StatAssetProps {
  value: ReactNode;
  valueTitle: string;
  isRed?: boolean;
  isActive?: boolean;
  borderStyle?: boolean;
  onClick?: () => void;
}

export const StatAsset: FC<StatAssetProps> = ({
  value,
  valueTitle,
  isRed,
  isActive,
  borderStyle,
  onClick,
}) => {
  return (
    <div
      className={`card stat ${value == -1 ? 'skeleton-stat' : ''} ${isActive && 'stat-active'} ${!onClick && 'default'} ${borderStyle && 'border-stat'}`}
      onClick={onClick}>
      <div className={`value`}>{value}</div>
      <p className={`${isRed && 'codefend-text-red-200'}`}>{valueTitle}</p>
    </div>
  );
};
