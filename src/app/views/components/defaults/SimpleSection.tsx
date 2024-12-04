import { type FC, type ReactNode } from 'react';

interface SimpleSectionProps {
  header: string;
  icon: ReactNode;
  children: ReactNode;
}

export const SimpleSection: FC<SimpleSectionProps> = ({ header, icon, children }) => {
  return (
    <>
      <div className="header">
        <div className="title">
          <div className="icon">{icon}</div>
          <span>{header}</span>
        </div>
      </div>
      {children}
    </>
  );
};

export default SimpleSection;
