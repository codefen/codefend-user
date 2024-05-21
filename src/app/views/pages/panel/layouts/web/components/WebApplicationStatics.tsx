import React from 'react';
import { ChartIcon } from '@icons';
import type { Webresource } from '@interfaces/panel.ts';
import { MetricsService } from '@utils/metric.service.ts';
import { StatAsset } from '@standalones/stat-asset/StatAsset.tsx';

interface WebResourceStaticProps {
	webResources: Webresource[];
}
export const WebApplicationStatics: React.FC<WebResourceStaticProps> = ({
	webResources,
}) => {
	const { getCompanyMetric } = MetricsService;

	return (
		<div className="card stats">
			<div className="header">
				<div className="title">
					<div className="icon">
						<ChartIcon />
					</div>
					<span>Domain & server statics</span>
				</div>
				<div className="actions"></div>
			</div>
			<div className="content">
				<StatAsset
					value={getCompanyMetric(webResources, 'domain')}
					valueTitle="Domains"
				/>
				<StatAsset
					value={getCompanyMetric(webResources, 'subDomain')}
					valueTitle="Subdomains"
				/>
				<StatAsset
					value={getCompanyMetric(webResources, 'uniqueIp')}
					valueTitle="Unique IPS"
				/>
			</div>
		</div>
	);
};
