import React, { useEffect } from 'react';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { getNetworkMetrics } from '@utils/metric.service';

interface WebResourceStaticProps {
  networkResources: any[];
}
export const NetworkStatics: React.FC<WebResourceStaticProps> = ({ networkResources }) => {
  const globalStore = useGlobalFastFields([
    'externalIpCount',
    'internalIpCount',
    'subNetworkCount',
    'planPreference',
    'isDefaultPlan',
  ]);

  useEffect(() => {
    const metrics = getNetworkMetrics(networkResources);
    globalStore.externalIpCount.set(metrics.externalIpCount);
    globalStore.internalIpCount.set(metrics.internalIpCount);
    globalStore.subNetworkCount.set(metrics.subNetworkCount);
    if (globalStore.isDefaultPlan.get) {
      if (metrics.totalIpCount <= 20) {
        globalStore.planPreference.set('small');
      } else if (metrics.totalIpCount <= 200) {
        globalStore.planPreference.set('medium');
      } else {
        globalStore.planPreference.set('advanced');
      }
    }
  }, [networkResources, globalStore.planPreference.get, globalStore.isDefaultPlan.get]);

  return (
    <div className="flex-box">
      <StatAsset value={globalStore.externalIpCount.get} valueTitle="External IPs" />
      <StatAsset value={globalStore.internalIpCount.get} valueTitle="Internal IPs" />
      <StatAsset value={globalStore.subNetworkCount.get} valueTitle="Sub networks" />
    </div>
  );
};
