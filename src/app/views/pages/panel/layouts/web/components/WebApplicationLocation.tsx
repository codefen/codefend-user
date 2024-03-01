import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	CircleIcon,
	SimpleSection,
	Sort,
	TableV2,
} from '../../../../../components';
import {
	MetricsService,
	Webresources,
	generateIDArray,
	webLocationColumn,
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

	const dataTable = useMemo(
		() =>
			resources.map((resource: any) => ({
				ID: { value: '', style: '' },
				location: {
					value: (
						<>
							<span
								className={`flag flag-${resource.countryCode.toLowerCase()}`}></span>
							<pre>{' ' + resource.country}</pre>
						</>
					),
					style: 'location',
				},
				count: { value: resource.count, style: 'count' },
				percent: {
					value: `${resource.percentage}%`,
					style: 'percent',
				},
			})),
		[resources],
	);

	return (
		<div className="card !flex flex-col">
			<SimpleSection header="Web servers by location" icon={<CircleIcon />}>
				<TableV2
					columns={webLocationColumn}
					rowsData={dataTable}
					showEmpty={false}
					showRows={dataTable.length !== 0}
					sizeY={16}
					sizeX={93.75}
					sort={Sort.asc}
				/>
			</SimpleSection>
		</div>
	);
};
