import React, { useEffect } from 'react';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { getNetworkMetrics } from '@utils/metric.service';

interface WebResourceStaticProps {
  externalIpCount: number;
  internalIpCount: number;
  totalNotUniqueIpCount: number;
}
export const NetworkStatics: React.FC<WebResourceStaticProps> = ({
  externalIpCount,
  internalIpCount,
  totalNotUniqueIpCount,
}) => {
  return (
    <div className="flex-box">
      <StatAsset value={externalIpCount} valueTitle="External IPs" />
      <StatAsset value={internalIpCount} valueTitle="Internal IPs" />
      <StatAsset value={totalNotUniqueIpCount} valueTitle="Total IPs" />
    </div>
  );
};
