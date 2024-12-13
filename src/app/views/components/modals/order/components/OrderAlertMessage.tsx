import type { FC, PropsWithChildren, ReactNode } from 'react';

interface OrderAlertMessageProps extends PropsWithChildren {
  title: string;
  imageIcon: ReactNode;
}

export const OrderAlertMessage: FC<OrderAlertMessageProps> = ({ title, imageIcon, children }) => (
  <div className="scope-welcome">
    <div className="codefend-img">{imageIcon}</div>
    <div className="welcome-container">
      <h3>{title}</h3>
      <div className="top">{children}</div>
    </div>
  </div>
);
