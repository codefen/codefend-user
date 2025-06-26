import type { FC, ReactNode } from 'react';

interface ResourceFigureProps {
  icon: ReactNode;
  title: string;
  click?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

const ResourceFigures: FC<ResourceFigureProps> = ({ icon, title, click, isActive, isDisabled }) => {
  const handleClick = (e: any) => {
    if (click && !isDisabled) click();
  };
  return (
    <figure
      className={`welcome-resource ${!isDisabled && isActive ? 'resource-selected' : ''} ${isDisabled ? 'full-disable' : ''}`}
      onClick={handleClick}>
      {icon}
      <figcaption className={'caption-card'}>
        <h4>{title}</h4>
      </figcaption>
    </figure>
  );
};

export default ResourceFigures;
