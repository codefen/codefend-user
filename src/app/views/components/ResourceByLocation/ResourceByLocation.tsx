import { useEffect, useState, type FC } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import { MetricsService } from '@utils/metric.service.ts';
import type { Lead } from '@interfaces/lead.ts';
import type { ResellerUser } from '@interfaces/user.ts';
import type { Webresource } from '@interfaces/panel.ts';
import type { FullOrder } from '@interfaces/order';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';

interface ResourceByLocationProps {
  resource: Lead[] | ResellerUser[] | Webresource[] | FullOrder[];
  isLoading: boolean;
  type: string;
  title: string;
}

export const locationCollumnV3: ColumnTableV3[] = [
  {
    header: 'Location',
    key: 'location',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-location-1',
    weight: '50%',
    render: (resource: any) => (
      <LocationItem country={resource?.country} countryCode={resource?.countryCode} />
    ),
  },
  {
    header: 'Count',
    key: 'count',
    styles: 'item-cell-location-2',
    weight: '25%',
    render: (resource: any) => resource,
  },
  {
    header: 'Percentage',
    key: 'percentage',
    styles: 'item-cell-location-3',
    weight: '25%',
    render: (resource: any) => `${resource}%`,
  },
];

export const ResourceByLocation: FC<ResourceByLocationProps> = ({
  resource,
  isLoading,
  type,
  title,
}) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  useEffect(() => {
    const metrics = MetricsService.getCountryMetrics(resource, type);
    setMetrics(metrics);
  }, [resource, type]);

  return (
    <div className="card location-card">
      <div className="header">
        <span>Server geolocation</span>
      </div>
      <div className="content">
        <Tablev3
          columns={locationCollumnV3}
          rows={metrics}
          showRows={!isLoading}
          initialSort={Sort.asc}
        />
      </div>
    </div>
  );
};
