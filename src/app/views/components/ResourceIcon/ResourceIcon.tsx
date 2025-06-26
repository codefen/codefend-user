import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import {
  BugIcon,
  CLoudIcon,
  DataleakSearchIcon,
  GlobeWebIcon,
  LanIcon,
  MobileIcon,
  PeopleGroupIcon,
  SourceCodeIcon,
} from '@icons';

export const ResourceIcon = ({ resourceClass }: any) => {
  if (resourceClass == RESOURCE_CLASS.LEAKS) return <DataleakSearchIcon />;
  if (resourceClass == RESOURCE_CLASS.WEB) return <GlobeWebIcon />;
  if (resourceClass == RESOURCE_CLASS.MOBILE) return <MobileIcon />;
  if (resourceClass == RESOURCE_CLASS.CLOUD) return <CLoudIcon />;
  if (resourceClass == RESOURCE_CLASS.SOURCE) return <SourceCodeIcon />;
  if (resourceClass == RESOURCE_CLASS.SOCIAL) return <PeopleGroupIcon />;
  if (resourceClass == 'lan') return <LanIcon />;

  return <BugIcon />;
};
