import { type FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleIcon } from '@icons';
import { generateIDArray } from '@utils/helper';
import type { ResourceCount } from '@interfaces/dashboard';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import css from './dashboardasset.module.scss';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { AnimatedCount } from '@/app/views/components/stat-asset/AnimatedCount';

const hiddenResources = [RESOURCE_CLASS.CLOUD, RESOURCE_CLASS.SOURCE];

export const DashboardAssets: FC<{
  resources: Partial<ResourceCount>;
  hasTitle?: boolean;
  disabled?: boolean;
  borderStyle?: boolean;
  animateMetrics?: boolean;
}> = ({
  resources,
  hasTitle = true,
  borderStyle = false,
  disabled = false,
  animateMetrics = false,
}) => {
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
        .map((resource, i) => {
          const value = resources[resource as keyof ResourceCount] ?? -1;
          return (
            <StatAsset
              key={resourceKeys[i]}
              valueTitle={mapAssetsNames[resource as keyof typeof mapAssetsNames]}
              value={
                animateMetrics && value != -1 ? (
                  <AnimatedCount value={value} delay={450 + i * 55} />
                ) : (
                  value
                )
              }
              isActive={isActivePath(resource)}
              borderStyle={borderStyle}
              onClick={() => navigateTo(resource)}
            />
          );
        })}
    </div>
  );
};

export default DashboardAssets;
