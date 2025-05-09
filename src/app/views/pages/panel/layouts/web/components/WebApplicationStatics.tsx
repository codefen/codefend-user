import React, { useEffect } from 'react';
import { ChartIcon } from '@icons';
import type { Webresource } from '@interfaces/panel.ts';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { getCompanyAllMetrics } from '@utils/metric.service';

interface WebResourceStaticProps {
  webResources: Webresource[];
}
export const WebApplicationStatics: React.FC<WebResourceStaticProps> = ({ webResources }) => {
  const globalStore = useGlobalFastFields([
    'subDomainCount',
    'uniqueIpCount',
    'domainCount',
    'planPreference',
    'isDefaultPlan',
  ]);

  useEffect(() => {
    const metrics = getCompanyAllMetrics(webResources);
    globalStore.domainCount.set(metrics.domainCount);
    globalStore.subDomainCount.set(metrics.subDomainCount);
    globalStore.uniqueIpCount.set(metrics.uniqueIpCount);
    globalStore.isDefaultPlan.set(true);

    if (metrics.domainCount <= 2 && metrics.subDomainCount <= 6) {
      globalStore.planPreference.set('small');
    } else if (metrics.domainCount <= 5 && metrics.subDomainCount <= 15) {
      globalStore.planPreference.set('medium');
    } else {
      globalStore.planPreference.set('advanced');
    }
  }, [webResources]);

  return (
    <div className="flex-box">
      <StatAsset value={globalStore.domainCount.get} valueTitle="Domains" />
      <StatAsset value={globalStore.subDomainCount.get} valueTitle="Subdomains" />
      <StatAsset value={globalStore.uniqueIpCount.get} valueTitle="Unique IPS" />
    </div>
  );
};
