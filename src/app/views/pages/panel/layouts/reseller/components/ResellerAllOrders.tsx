import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import {
	resellerCompanyColumns,
	resellerOrdersColumn,
	resellerUserActiveColumns,
} from '@mocks/defaultData';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import type { FC } from 'react';
import type { Company } from '@interfaces/company';
import type { FullOrder } from '@interfaces/order';
import { formatDate } from '@utils/helper';

interface ResellerAllOrdersProps {
	orders: FullOrder[];
	isLoading: boolean;
}

export const ResellerAllOrders: FC<ResellerAllOrdersProps> = ({
	orders,
	isLoading,
}) => {
	const dataTable = orders.map(
		(order: FullOrder) =>
			({
				ID: { value: '', style: '' },
				Identifier: { value: order.id, style: 'id' },
				area: {
					value: (
						<LocationItem
							country={order.user_pais || 'unknown'}
							countryCode={order.user_pais_code}
						/>
					),
					style: 'area',
				},
				orderType: { value: order.resources_class, style: 'type' },
				orderState: { value: order.condicion_provider, style: 'state' },
				paymentState: { value: order.condicion_financial, style: 'state' },
				published: { value: order.creacion, style: 'date' },
				publishPay: {
					value: order.fecha_financial_confirmacion,
					style: 'date',
				},
				publishedFinish: {
					value: order.fecha_cierre_real || '---',
					style: 'date',
				},
			}) as any,
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
