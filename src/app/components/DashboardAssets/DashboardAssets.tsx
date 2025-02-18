import { type FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import { CircleIcon } from '@icons';
import { generateIDArray } from '@utils/helper';
import { StatAsset } from '@/app/components/stat-asset/StatAsset';
import type { ResourceCount } from '@interfaces/dashboard';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import css from './dashboardasset.module.scss';

export const DashboardAssets: FC<{ resources: ResourceCount }> = ({ resources }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const resourceKeys = useMemo(
    () => generateIDArray(Object.keys(resources).length),
    [Object.keys(resources).length]
  );

  const isActivePath = (current: string) => {
    if (current === RESOURCE_CLASS.WEB) return location.pathname === '/dashboard';
    return current === location.pathname;
  };

  const mapAssetsNames = {
    [RESOURCE_CLASS.WEB]: 'WEB & EXTERNAL',
    [RESOURCE_CLASS.MOBILE]: 'MOBILE APPS',
    ['lan']: 'NETWORK',
    [RESOURCE_CLASS.CLOUD]: 'CLOUD ASSETS',
    [RESOURCE_CLASS.SOURCE]: 'SOURCE CODE',
    [RESOURCE_CLASS.SOCIAL]: 'SOCIAL ENGINEERING',
  };
  return (
    <div className={`${css['stats']} ${css['card']}`}>
      <SimpleSection header="Attack surface surveillance" icon={<CircleIcon />}>
        <div className={css['content']}>
          {Object.keys(resources).map((resource: string | number, i: number) => (
            <StatAsset
              key={resourceKeys[i]}
              valueTitle={mapAssetsNames[resource as keyof typeof mapAssetsNames]}
              value={resources[resource as keyof typeof resources]}
              isActive={isActivePath(resource as string)}
              onClick={() => navigate(`/${resource}`)}
            />
          ))}
        </div>
      </SimpleSection>
    </div>
  );
};

export default DashboardAssets;
