import React from 'react';
import { ChartIcon } from '../../../../../components';
import { MetricsService, Webresources } from '../../../../../../data';

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
				<div className="stat">
					<div className="value">
						{getCompanyMetric(getResources(), 'domain')}
					</div>
					<p className="codefend-text-red-200">Domains</p>
				</div>
				<div className="stat">
					<div className="value">
						{getCompanyMetric(getResources(), 'subDomain')}
					</div>
					<p>Subdomains</p>
				</div>
				<div className="stat">
					<div className="value">
						{getCompanyMetric(getResources(), 'uniqueIp')}
					</div>
					<p>Unique IPS</p>
				</div>
			</div>
		</div>
	);
};
