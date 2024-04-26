import { SimpleSection } from '@defaults/SimpleSection';
import { CircleIcon } from '@icons';
import { Sort } from '@interfaces/table';
import { locationTableColumn } from '@mocks/defaultData';
import { MetricsService } from '@utils/metric.service';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import { useMemo, useState, type FC } from 'react';
import type { Lead } from '@interfaces/lead';

interface ResellerByLocationProps {
	leads: Lead[];
	isLoading: boolean;
}

export const ResellerByLocation: FC<ResellerByLocationProps> = ({
	leads,
	isLoading,
}) => {
	const dataTable = MetricsService.getLeadsCountryMetrics(leads).map(
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
	);

	return (
		<div className="card location-card">
			<SimpleSection header="Leads by location" icon={<CircleIcon />}>
				<TableV2
					columns={locationTableColumn}
					rowsData={dataTable}
					showEmpty={!isLoading && !Boolean(dataTable.length)}
					showRows={!isLoading}
					sort={Sort.asc}
				/>
			</SimpleSection>
		</div>
	);
};
