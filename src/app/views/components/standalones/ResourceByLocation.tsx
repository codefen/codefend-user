import { type FC } from 'react';
import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import { CircleIcon } from '@icons';
import { Sort } from '@interfaces/table.ts';
import { locationTableColumn } from '@mocks/defaultData.ts';
import { MetricsService } from '@utils/metric.service.ts';
import { LocationItem } from '@standalones/utils/LocationItem.tsx';
import { TableV2 } from '@table/tablev2.tsx';
import type { Lead } from '@interfaces/lead.ts';
import type { ResellerUser } from '@interfaces/user.ts';
import type { Webresource } from '@interfaces/panel.ts';
import type { FullOrder } from '@interfaces/order';

interface ResourceByLocationProps {
  resource: Lead[] | ResellerUser[] | Webresource[] | FullOrder[];
  isLoading: boolean;
  type: string;
  title: string;
}

export const ResourceByLocation: FC<ResourceByLocationProps> = ({
  resource,
  isLoading,
  type,
  title,
}) => {
  const dataTable = MetricsService.getCountryMetrics(resource, type).map((resource: any) => ({
    ID: { value: '', style: '' },
    location: {
      value: <LocationItem country={resource?.country} countryCode={resource?.countryCode} />,
      style: 'location',
    },
    count: { value: resource.count, style: 'count' },
    percent: {
      value: `${resource.percentage}%`,
      style: 'percent',
    },
  }));

  return (
    <div className="card location-card">
      <SimpleSection header={title} icon={<CircleIcon />}>
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
