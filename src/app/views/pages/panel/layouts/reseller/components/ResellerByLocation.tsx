import { SimpleSection } from '@defaults/SimpleSection';
import { CircleIcon } from '@icons';
import { Sort } from '@interfaces/table';
import { locationTableColumn } from '@mocks/defaultData';
import { MetricsService } from '@services/metric.service';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';

interface LocationResource {
	serverCountryCode: string;
	serverCountry: string;
}

interface ResellerByLocationProps {
	locationResource: LocationResource[];
	isLoading: boolean;
}

export const ResellerByLocation: FC<ResellerByLocationProps> = ({
	locationResource,
	isLoading,
}) => {
	const getResources = isLoading ? [] : locationResource;

	const dataTable = useMemo(
		() =>
			MetricsService.getCountryMetrics(getResources).map(
				(resource: any) => ({
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
				}),
			),
		[locationResource],
	);

	return (
		<div className="card location-card">
			<SimpleSection header="Leads by location" icon={<CircleIcon />}>
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
