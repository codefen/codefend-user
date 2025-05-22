import { type FC } from 'react';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';

interface WebResourceStaticProps {
  domainCount: number;
  subDomainCount: number;
  uniqueIpCount: number;
}

export const WebApplicationStatics: FC<WebResourceStaticProps> = ({
  domainCount,
  subDomainCount,
  uniqueIpCount,
}) => {
  return (
    <div className="flex-box">
      <StatAsset value={domainCount} valueTitle="Domains" />
      <StatAsset value={subDomainCount} valueTitle="Subdomains" />
      <StatAsset value={uniqueIpCount} valueTitle="Unique IPS" />
    </div>
  );
};
