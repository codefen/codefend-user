import type { FC, PropsWithChildren, ReactNode } from 'react';
import './util.scss';

interface IconTextPairsProps extends PropsWithChildren {
  icon: ReactNode;
  className?: string;
  title?: string;
}

export const IconTextPairs: FC<IconTextPairsProps> = ({ icon, children, className, title }) => (
  <div className={`icon-text-pair ${className && className}`} title={title && title}>
    {icon}
    {children}
  </div>
);
