import type { FC, ReactNode } from 'react';
import css from './statasset.module.scss';

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
      className={`${css['stat']} ${isActive && css['stat-active']} ${!onClick && css['default']} ${borderStyle && 'border-stat'}`}
      onClick={onClick}>
      <div className={css['value']}>{value}</div>
      <p className={`${isRed && 'codefend-text-red-200'}`}>{valueTitle}</p>
    </div>
  );
};
