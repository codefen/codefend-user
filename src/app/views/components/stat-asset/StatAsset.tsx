import type { FC, ReactNode } from 'react';
import css from './statasset.module.scss';

export interface StatAssetProps {
  value: ReactNode;
  valueTitle: string;
  isRed?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const StatAsset: FC<StatAssetProps> = ({ value, valueTitle, isRed, isActive, onClick }) => {
  return (
    <div
      className={`${css['stat']} ${isActive && css['stat-active']} ${!onClick && css['default']}`}
      onClick={onClick}>
      <div className={css['value']}>{value}</div>
      <p className={`${isRed && 'codefend-text-red-200'}`}>{valueTitle}</p>
    </div>
  );
};
