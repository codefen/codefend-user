import type { FC, ReactNode } from 'react';
import './resourcefigure.scss';
import Show from '@/app/views/components/Show/Show';

interface ResourceFigureProps {
  icon: ReactNode;
  title: string;
  count?: number;
  click?: () => void;
  isActive?: boolean;
}

export const ResourceFigure: FC<ResourceFigureProps> = ({
  count,
  icon,
  title,
  click,
  isActive,
}) => {
  const handleClick = (e: any) => {
    if (click && isActive) click();
  };
  return (
    <figure
      className={`report-type-card ${!isActive && 'report-type-disable'}`}
      onClick={handleClick}
      aria-hidden={isActive ? 'false' : 'true'}
      title={
        isActive ? 'Figure of a resource' : 'No vulnerabilities associated with these resources'
      }>
      {icon}

      <figcaption className={'caption-card'}>
        <h4>{title}</h4>
        <Show when={count !== undefined}>
          <h5>
            total issues <span>{count}</span>
          </h5>
        </Show>
      </figcaption>
    </figure>
  );
};
