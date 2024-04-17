import React from 'react';
import { ChartIcon } from '@icons';
import type { Webresources } from '@interfaces/panel.ts';
import { MetricsService } from '@utils/metric.service.ts';
import { StatAsset } from '@standalones/stat-asset/StatAsset.tsx';

interface WebResourceStaticProps {
	webResources: Webresources[];
	isLoading: boolean;
}
export const WebApplicationStatics: React.FC<WebResourceStaticProps> = ({
	webResources,
	isLoading,
}) => {
	const getResources = () => {
		const resources = isLoading ? [] : webResources;
		return resources ?? [];
	};

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
					value={getCompanyMetric(getResources(), 'domain')}
					valueTitle="Domains"
				/>
				<StatAsset
					value={getCompanyMetric(getResources(), 'subDomain')}
					valueTitle="Subdomains"
				/>
				<StatAsset
					value={getCompanyMetric(getResources(), 'uniqueIp')}
					valueTitle="Unique IPS"
				/>
			</div>
		</div>
	);
};
