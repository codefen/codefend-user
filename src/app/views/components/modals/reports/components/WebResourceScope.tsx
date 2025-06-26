import { type FC } from 'react';
import { type ResourceScope, webResourcesWithoutActions } from '../../../../../data';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { TableWithoutActions } from '@table/TableWithoutActions';
import { flattenRows } from '@utils/sort.service';
import TextChild from '@/app/views/components/utils/TextChild';

export const WebResourceScope: FC<ResourceScope<any[]>> = ({ resources, isLoading }) => {
  const scopeDataTable = resources
    ? flattenRows(resources, 0).map((mainNetwork: any, i: number) => ({
        ID: { value: '', style: '' },
        Identifier: { value: mainNetwork.id, style: 'id' },
        domainName: {
          value: !mainNetwork?.resource_domain_dad ? (
            mainNetwork.resource_domain
          ) : (
            <TextChild
              subNetwork={mainNetwork.resource_domain}
              isLast={!mainNetwork.resource_domain_dad}
            />
          ),
          style: 'domain-name',
        },
        mainServer: {
          value: mainNetwork.main_server,
          style: 'server-ip',
        },
        location: {
          value: (
            <LocationItem
              key={mainNetwork.id + i + '-l'}
              country={mainNetwork.server_pais}
              countryCode={mainNetwork.server_pais_code}
            />
          ),
          style: 'location',
        },
      }))
    : [];

  return (
    <TableWithoutActions
      columns={webResourcesWithoutActions}
      resources={scopeDataTable}
      isLoading={isLoading}
      id={2}
      needMarker
      type="web"
    />
  );
};
