import { CheckCircleIcon, GlobeWebIcon, XCircleIcon } from '@icons';
import { resellerOrdersColumn } from '@mocks/defaultData';
import { TableV2 } from '@table/tablev2';
import type { FC } from 'react';
import type { FullOrder } from '@interfaces/order';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

interface ResellerAllOrdersProps {
  orders: FullOrder[];
  isLoading: boolean;
}

export const ResellerAllOrders: FC<ResellerAllOrdersProps> = ({ orders, isLoading }) => {
  const dataTable = orders.map(
    (order: FullOrder) =>
      ({
        ID: { value: '', style: '' },
        Identifier: { value: order.id, style: 'id' },
        area: {
          value: (
            <LocationItem
              country={order.user_pais || 'unknown'}
              countryCode={order.user_pais_code || ''}
            />
          ),
          style: 'area',
        },
        orderType: { value: order.resources_class, style: 'type' },
        plan: { value: order.chosen_plan, style: 'plan' },

        funds: {
          value: `$${order.funds_full}`,
          style: 'funds',
        },
        published: { value: order.creacion, style: 'date' },
        paid: {
          value:
            order?.condicion_financial == 'confirmed' ? (
              <CheckCircleIcon name="y" />
            ) : (
              <XCircleIcon name="n" />
            ),
          style: `paid ${order?.condicion_financial == 'confirmed' ? 'confirmed' : 'unconfirmed'}`,
        },
        finish: {
          value:
            order?.condicion_provider == 'finished' ? (
              <CheckCircleIcon name="y" />
            ) : (
              <XCircleIcon name="n" />
            ),
          style: `finish ${order?.condicion_provider == 'finished' ? 'confirmed' : 'unconfirmed'}`,
        },
      }) as any
  );

  return (
    <div className="card">
      <SimpleSection header="Listing all orders" icon={<GlobeWebIcon />}>
        <div className="">
          <TableV2
            columns={resellerOrdersColumn}
            rowsData={dataTable}
            showEmpty={!isLoading && !Boolean(dataTable.length)}
            showRows={!isLoading}
          />
        </div>
      </SimpleSection>
    </div>
  );
};
