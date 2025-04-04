import { type FC, type ReactNode } from 'react';
import css from './simplesection.module.scss';

interface SimpleSectionProps {
  header?: string;
  icon: ReactNode;
  children: ReactNode;
}

export const SimpleSection: FC<SimpleSectionProps> = ({ header, icon, children }) => {
  return (
    <>
      {header ? (
        <div className={`${css['header']} simple-section-header`}>
          <div className={css['title']}>
            <div className={css['icon']}>{icon}</div>
            <span>{header}</span>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
};
