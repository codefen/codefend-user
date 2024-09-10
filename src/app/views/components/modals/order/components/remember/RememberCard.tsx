import { SpaceInvaders } from '@icons';
import type { FC, PropsWithChildren } from 'react';
import './remember.scss';

interface RememberCardProps extends PropsWithChildren {}

export const RememberCard: FC<RememberCardProps> = ({ children }) => (
  <div className="welcome-remember">
    <SpaceInvaders />
    <div className="top">
      <p>
        <span className="codefend-text-red remember">Remember!</span> {children}
      </p>
    </div>
  </div>
);
