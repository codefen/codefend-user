import type { FC, PropsWithChildren, ReactNode } from 'react';
import {
  BugIcon,
  CLoudIcon,
  GlobeWebIcon,
  LanIcon,
  MobileIcon,
  NetworkIcon,
  PeopleGroupIcon,
  SourceCodeIcon,
} from '../..';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

interface ResourceIconTextProps {
  resourceClass: string;
  name?: string;
}

export const ResourceIconText: FC<ResourceIconTextProps> = ({ resourceClass, name }) => {
  const ResourceIcon = (props: any) => {
    if (props.resourceClass === RESOURCE_CLASS.WEB) return <GlobeWebIcon />;
    if (props.resourceClass === RESOURCE_CLASS.MOBILE) return <MobileIcon />;
    if (props.resourceClass === RESOURCE_CLASS.CLOUD) return <CLoudIcon />;
    if (props.resourceClass === RESOURCE_CLASS.SOURCE) return <SourceCodeIcon />;
    if (props.resourceClass === RESOURCE_CLASS.SOCIAL) return <PeopleGroupIcon />;
    if (props.resourceClass === 'lan') return <LanIcon />;

    return <BugIcon />;
  };

  return (
    <>
      <ResourceIcon resourceClass={resourceClass} />
      {name}
    </>
  );
};
