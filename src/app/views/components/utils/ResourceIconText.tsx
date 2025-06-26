import type { FC } from 'react';
import { ResourceIcon } from '@/app/views/components/ResourceIcon/ResourceIcon';

interface ResourceIconTextProps {
  resourceClass: string;
  name?: string;
}

export const ResourceIconText: FC<ResourceIconTextProps> = ({ resourceClass, name }) => {
  return (
    <>
      <ResourceIcon resourceClass={resourceClass} />
      <span className="ellipsis-text">{name}</span>
    </>
  );
};
