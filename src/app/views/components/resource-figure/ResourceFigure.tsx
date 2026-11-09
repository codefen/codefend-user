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
    <button
      type="button"
      disabled={!isActive}
      className={`report-type-card ${!isActive && 'report-type-disable'}`}
      onClick={handleClick}
      title={
        isActive ? 'Figure of a resource' : 'No vulnerabilities associated with these resources'
      }>
      {icon}

      <span className={'caption-card'}>
        <span className="resource-name">{title}</span>
        <Show when={count !== undefined}>
          <span className="resource-count">
            total issues <span>{count}</span>
          </span>
        </Show>
      </span>
    </button>
  );
};
