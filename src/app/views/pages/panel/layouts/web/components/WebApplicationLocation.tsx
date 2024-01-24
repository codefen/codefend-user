import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleIcon, SimpleSection } from '../../../../../components';
import {
	MetricsService,
	Webresources,
	generateIDArray,
} from '../../../../../../data';

export const WebApplicationLocation: React.FC<{
	webResources: Webresources[];
	isLoading: boolean;
}> = ({ webResources, isLoading }) => {
	const [resources, setResources] = useState([] as any);

	const getResources = useCallback(
		() => (isLoading ? [] : webResources),
		[isLoading, webResources],
	);

	const metrics = useMemo(
		() => MetricsService.getCountryMetrics(getResources()),
		[getResources],
	);

	useEffect(() => {
		setResources(metrics);
	}, [metrics]);

	const resourcesKey = useMemo(
		() => generateIDArray(resources.length),
		[resources],
	);

	return (
		<div className="card table">
			<SimpleSection header="Supervised assets" icon={<CircleIcon />}>
				<>
					<div className="columns-name">
						<div className="location">location</div>
						<div className="count">count</div>
						<div className="percent">percent</div>
					</div>
					<div className="rows">
						{resources.map((resource: any, index: number) => (
							<section key={resourcesKey[index]} className="item">
								<div className="location">
									<span
										className={`flag flag-${resource.countryCode.toLowerCase()}`}></span>
									{resource.country}
								</div>
								<div className="count">{resource.count}</div>
								<div className="percent">{resource.percentage}%</div>
							</section>
						))}
					</div>
				</>
			</SimpleSection>
		</div>
	);
};
