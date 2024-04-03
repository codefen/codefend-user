import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	CircleIcon,
	LocationItem,
	SimpleSection,
	TableV2,
} from '../../../../../components';
import {
	MetricsService,
	type Webresources,
	Sort,
	locationTableColumn,
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

	const dataTable = useMemo(
		() =>
			resources.map((resource: any) => ({
				ID: { value: '', style: '' },
				location: {
					value: (
						<LocationItem
							country={resource.country}
							countryCode={resource.countryCode}
						/>
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
		<div className="card location-card">
			<SimpleSection header="Web servers by location" icon={<CircleIcon />}>
				<TableV2
					columns={locationTableColumn}
					rowsData={dataTable}
					showEmpty={false}
					showRows={dataTable.length !== 0}
					sizeX={93.75}
					sort={Sort.asc}
				/>
			</SimpleSection>
		</div>
	);
};
