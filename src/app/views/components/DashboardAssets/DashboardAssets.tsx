import { type FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleIcon } from '@icons';
import { generateIDArray } from '@utils/helper';
import type { ResourceCount } from '@interfaces/dashboard';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import css from './dashboardasset.module.scss';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';

const hiddenResources = [RESOURCE_CLASS.CLOUD, RESOURCE_CLASS.SOURCE];

export const DashboardAssets: FC<{
  resources: ResourceCount;
  hasTitle?: boolean;
  disabled?: boolean;
  borderStyle?: boolean;
}> = ({ resources, hasTitle = true, borderStyle = false, disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const resourceKeys = useMemo(
    () => generateIDArray(Object.keys(resources).length),
    [Object.keys(resources).length]
  );

  const isActivePath = (current: string) => {
    if (disabled) {
      return false;
    }
    if (current === RESOURCE_CLASS.WEB) return location.pathname === '/dashboard';
    return current === location.pathname;
  };

  const mapAssetsNames = {
    [RESOURCE_CLASS.WEB]: 'WEB & EXTERNAL',
    [RESOURCE_CLASS.MOBILE]: 'MOBILE APPS',
    ['lan']: 'NETWORK',
    [RESOURCE_CLASS.SOCIAL]: 'SOCIAL ENGINEERING',
  };
  const navigateTo = (resource: string | number) => {
    if (disabled) return;
    navigate(`/${resource === 'lan' ? 'network' : resource}`);
  };
  return (
    <div className="grid-2x2">
      {Object.keys(resources)
        .filter(resource => !hiddenResources.includes(resource as RESOURCE_CLASS))
        .map((resource: string | number, i: number) => (
          <StatAsset
            key={resourceKeys[i]}
            valueTitle={mapAssetsNames[resource as keyof typeof mapAssetsNames]}
            value={resources[resource as keyof typeof resources] || -1}
            isActive={isActivePath(resource as string)}
            borderStyle={borderStyle}
            onClick={() => navigateTo(resource)}
          />
        ))}
    </div>
  );
};

export default DashboardAssets;
